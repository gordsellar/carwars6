/* global angular, CW */
angular.module('carwars').
    factory('server', function ($http, $q, $location, vehicle, model2d) {
        "use strict";
        var lastSavedEmail, lastSavedName;
        return {
            currentUser: function() {
                return CW.readCookie('author_email');
            },
            currentUserName: function() {
                return CW.readCookie('author_name');
            },
            currentUserSignature: function() {
                return CW.readCookie('author_design_sig');
            },
            userEmailForSave: function() {
                return CW.readCookie('author_email') || lastSavedEmail;
            },
            userNameForSave: function() {
                return CW.readCookie('author_name') || lastSavedName;
            },
            isAdmin: function() {
                return CW.readCookie('role') === 'Admin';
            },
            lastSaveAuthorEmail: function() {
                return lastSavedEmail;
            },
            lastSaveAuthorName: function() {
                return lastSavedName;
            },
            createAccount: function(email, success, error) {
                $http.post('/beginAccount', {email: email}).success(success).error(error);
            },
            loadAccountConfirm: function(key, success, error) {
                $http.post('/confirm', {key: key}).success(success).error(error);
            },
            confirmAccount: function(email, name, password, key, success, error) {
                var data = {email: email, name: name, password: password, key: key};
                $http.post('/createAccount', data).success(success).error(error);
            },
            resetPassword: function(email, success, error) {
                $http.post('/resetPassword', {email: email}).success(success).error(error);
            },
            login: function(email, password, success, error) {
                var data = "username=" + encodeURIComponent(email) +
                     "&password=" + encodeURIComponent(password);
                $http({
                    method: 'POST',
                    url: '/login',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: data
                }).success(function() {
                    if(CW.readCookie('author_email')) {
                        success();
                    }
                    else error();
                }).error(error);
            },
            logout: function(success, error) {
                lastSavedName = null;
                lastSavedEmail = null;
                $http.post('/logout').success(success).error(error);
            },
            listDesigns: function(success, error) {
                $http.get('/api/secure/designs').success(function(data) {
                    var result = {
                        div5: [],
                        div10: [],
                        div15: [],
                        div20: [],
                        div25: [],
                        div30: [],
                        bus: [],
                        semiTrailer: [],
                        semiTractor: [],
                        tenWheeler: [],
                        carTrailer: [],
                        other: []
                    };
                    for(var i=0; i<data.length; i++) {
                        if (/bus/i.test(data[i].body)) {
                            result.bus.push(data[i]);
                        } else if (/40'/.test(data[i].body)) {
                            result.semiTrailer.push(data[i]);
                        } else if (data[i].body === 'Cabover' || data[i].body === 'Longnose') {
                            result.tenWheeler.push(data[i]);
                        } else if (/Cabover/.test(data[i].body) || /Longnose/.test(data[i].body)) {
                            result.semiTractor.push(data[i]);
                        } else if (/Flatbed/.test(data[i].body) || /.+Van/.test(data[i].body)) {
                            result.carTrailer.push(data[i]);
                        } else if (data[i].cost <= 5000) {
                            result.div5.push(data[i]);
                        } else if (data[i].cost <= 10000) {
                            result.div10.push(data[i]);
                        } else if (data[i].cost <= 15000) {
                            result.div15.push(data[i]);
                        } else if (data[i].cost <= 20000) {
                            result.div20.push(data[i]);
                        } else if (data[i].cost <= 25000) {
                            result.div25.push(data[i]);
                        } else if (data[i].cost <= 30000) {
                            result.div30.push(data[i]);
                        } else {
                            result.other.push(data[i]);
                        }
                    }
                    success(result);
                }).error(error);
            },
            loadDesign: function(designId, success, error) {
                $http.get('/api/designs/'+designId).success(success).error(error);
            },
            loadDesignAdmin: function(designId, success, error) {
                $http.get('/admin/designs/'+designId).success(success).error(error);
            },
            generateDesignData: function(car, authorName, authorEmail, stockCar, tags, notes, signature, image) {
                car.prepareForSave();
                car.recalculate();
                var data = {
                    id: car.designId,
                    body_type: car.body.name,
                    cost: car.totalCost + (car.sidecar ? car.sidecar.totalCost() : 0),
                    weight: car.weightUsed,
                    top_speed: car.currentTopSpeed,
                    hc: car.modifiedHandlingClass,
                    acceleration: car.displayAcceleration,
                    tech_level: car.techLevel,
                    designer_credit: '',
                    designer_signature: signature,
                    designer_notes: notes,
                    vehicle: car.type,
                    cargo_space: car.totalCargoSpace(),
                    cargo_weight: car.totalCargoWeight(),
                    passengers: car.passengerCount(),
                    encumbrance: car.hasPersonalEquipment() ? car.personalEquipmentWeight ? 'Alternate' : 'GE' : '',
                    tags: tags,
                    author_name: authorName,
                    author_email: authorEmail,
                    design_name: car.designName,
                    stock_car: stockCar,
                    image: image
                };
                if(stockCar) data.summary = (car.legal ? '' : 'ILLEGAL DESIGN: ')+car.textDescription(true);
                data.design_data = JSON.stringify(car, function (key, val) {
                    if (key === 'powerPlantList') return undefined;     // Will be set on car that data is loaded into
                    if (key === 'item' && this.type && this.type === 'Component Armor') return null;
                    if (key === 'cycle') return null;  // The cycle associated with a sidecar
                    if (key === 'cab') return null;    // The 10-wheel cab associated with a 10-wheel carrier
                    if (key === 'history') return undefined;            // Will be set on back-end load
                    if (key === 'division') return undefined;           // Will be set on back-end load TODO: remove this
                    if (key === 'tags') return undefined;           // Will be set on back-end load
                    if (key === 'designer_comments') return undefined;  // Will be set on back-end load
                    if (key === 'signature') return undefined;          // Will be set on back-end load
                    if (key === '$$hashKey') return undefined;          // Not sure where this comes from
                    return val;
                });
                return data;
            },
            saveDesign: function(car, authorName, authorEmail, stockCar, tags, notes, signature, image, success, error) {
                lastSavedEmail = authorEmail;
                lastSavedName = authorName;
                var data = this.generateDesignData(car,authorName,authorEmail,stockCar,tags,notes,signature,image);
                car.designId = Math.round(Math.random() * 1000000000000000); // Don't want to save twice with the same ID
                $http.post('/designs', data).success(function() {
                    car.tags = [];
                    for(var i=0; i<tags.length; i++) {
                        car.tags.push({tag: tags[i], count: 1});
                    }
                    car.designer_name = authorName;
                    car.designer_comments = notes;
                    car.signature = signature;
                    success();
                }).error(error);
            },
            deleteDesign: function(id, success, error) {
                $http.get('/delete/'+id).success(success).error(error);
            },
            generateDiagramData: function(car) {
                var result;
                var temp = !model2d.car;
                if(temp) { // Draw first to an offscreen canvas to establish text sizes and etc.
                    model2d.createNewCar(car, true);
                    var canvas = document.createElement('canvas');
                    canvas.width = 10;
                    canvas.height = 10;
                    model2d.car.draw(canvas.getContext('2d'), true);
                }
                result = CW.exportDesign(model2d.car);
                if(temp) model2d.destroy();
                return result;
            },
            generatePDF: function(car, lastSavedID, success, error) {
                var data = {
                    draw: this.generateDiagramData(car),
                    summary: car.textDescription(true),
                    walkaround: car.walkaroundDescription(),
                    worksheet: CW.exportWorksheet(car),
                    statistics: CW.exportStatistics(car, lastSavedID),
                    armor: car.armorValues(),
                    weapons: car.weaponValues(),
                    legal: car.legal
                };
                $http.post('/pdf', data).success(success).error(error);
            },
            updateStockCar: function(car, car2d, imageData, id, updateText, success, error) {
                var data = {
                    id: id,
                    image: imageData,
                    draw: car2d ? CW.exportDesign(car2d) : null,
                    summary: car.textDescription(true),
                    walkaround: car.walkaroundDescription(),
                    worksheet: CW.exportWorksheet(car),
                    statistics: CW.exportStatistics(car, id),
                    armor: car.armorValues(),
                    weapons: car.weaponValues(),
                    legal: car.legal,
                    text: updateText
                };
                $http.post('/admin/stock/update', data).success(success).error(error);
            },
            searchByName: function(name, offset, success, error) {
                $http.get('/search/'+name, {params: {offset: offset}}).success(success).error(error);
            },
            recentStockCars: function(success, error) {
                var cancel = $q.defer();
                $http.get('/api/stock/latest', {timeout: cancel.promise}).success(success).error(error);
                return cancel;
            },
            searchStockCars: function(list, offset, vehicle, tags, tech, minCost, maxCost, encumbrance, success, error) {
                var request = {
                    vehicle: vehicle || [],
                    tags: tags || [],
                    offset: offset,
                    list: null,
                    encumbrance: null,
                    techLevel: null
                };
                if(list) request.list = list;
                if(encumbrance) request.encumbrance = encumbrance === 'Weight' ? 'Alternate' : encumbrance;
                if(tech) request.techLevel = tech === 'UACFH' ? 'All' : tech;
                var cancel = $q.defer();
                $http.post('/api/stock/search', request, {timeout: cancel.promise}).success(success).error(error);
                return cancel;
            },
            countPendingStockCars: function(success, error) {
                $http.get('/admin/stock/count').success(success).error(error);
            },
            pendingStockCars: function(success, error) {
                $http.get('/admin/stock').success(success).error(error);
            },
            allCarIDs: function(success, error) {
                $http.get('/admin/ids').success(success).error(error);
            },
            saveReview: function(designId, rating, comments, tags, success, error) {
                var data = {rating: rating, comments: comments, tags: tags};
                $http.post("/stock/rating/"+designId, data).success(success).error(error);
            },
            deferStockCar: function(designId, success, error) {
                $http.post("/admin/defer/"+designId).success(success).error(error);
            },
            approveStockCar: function(designId, car, designerNotes, signature, reviewerNotes, reviewerRating,
                                      tags, success, error) {
                var data = {
                    // Fields needed to update stock car record
                    id: designId,
                    tech_level: car.techLevel,
                    reviewer_notes: reviewerNotes,
                    reviewer_rating: reviewerRating,
                    designer_notes: designerNotes,
                    signature: signature,
                    tags: tags,
                    // Fields needed to generate PDF
                    draw: this.generateDiagramData(car),
                    summary: car.textDescription(true),
                    walkaround: car.walkaroundDescription(),
                    worksheet: CW.exportWorksheet(car),
                    statistics: CW.exportStatistics(car, designId),
                    armor: car.armorValues(),
                    weapons: car.weaponValues(),
                    legal: car.legal
                };
                $http.post("/admin/stock", data).success(success).error(error);
            },
            loadDesignURL: function(designId) {
                return $location.protocol()+"://"+$location.host()+"/load/"+designId;
            },
            pdfURL: function(designID) {
                return $location.protocol()+"://"+$location.host()+"/content/designs/"+designID+".pdf";
            }
        };
    });
