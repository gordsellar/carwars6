/* global angular, CW */
angular.module('carwars').
    controller('StockListCtrl', function($scope, $compile, $timeout, $rootScope, stockList, server) {
        "use strict";

        $scope.zoom = null;
        $scope.currentUser = server.currentUser();
        var markRated = function(review) {
            if(review.current && (review.comments || review.rating)) this.rated = true;
        };

        $scope.$on('stock-car-list', function(event, list, previous, next, title) {
            $scope.listType = title;
            var f = function(tag){return tag.tag;};
            for(var i=0; i<list.length; i++) {
                list[i].url = '/content/designs/'+list[i].id+'.png';
                list[i].tagList = list[i].tags.map(f).join(", ");
                angular.forEach(list[i].ratings, markRated, list[i]);
            }
            $scope.stockCars = list;
            $scope.stockPrevious = previous;
            $scope.stockNext = next;
            document.querySelector('#StockListScroll').scrollTop = 0;
            if(stockList.nameSearch && list.length === 1 && !previous)
                $timeout(function() {
                    $scope.zoomTo({
                        target: document.querySelector('#StockListScroll div.StockCarDiv div.StockCarName')
                    }, list[0]);
                });
        });
        $scope.$on('stock-car-return', function() {
            $scope.zoom = null;
        });

        $scope.zoomTo = function($event, design) {
            var original = angular.element($event.target).parent();
            var div = original.clone();
            var name = div.children().eq(0);
            name.attr('ng-click', 'loadCar(zoom.name, zoom.id)');
            $compile(name)($scope);
            var img = div.children().eq(1);
            img.attr('ng-click', 'loadCar(zoom.name, zoom.id)');
            $compile(img)($scope);
            angular.forEach(div.children(), function(raw) {
                var child = angular.element(raw);
                if(child.hasClass('StockCarStars') || child.hasClass('StockCarTags') ||
                    (child.hasClass('Tech') && child.hasClass('Field') && child.hasClass('StockCar')))
                    $compile(child)(original.scope());
            });
            var target = angular.element(document.querySelector("#StockCarZoom")).children().eq(0);
            target.empty().append(div);
            $scope.zoom = design;
            if(design.summary) {
                var pos = design.summary.indexOf("\n\n");
                if (pos > -1) {
                    $scope.summaryFirst = design.summary.substr(0, pos);
                    $scope.summarySecond = design.summary.substr(pos + 2);
                } else if ((pos = design.summary.indexOf("\r\n\r\n")) > -1) {
                    $scope.summaryFirst = design.summary.substr(0, pos);
                    $scope.summarySecond = design.summary.substr(pos + 4);
                } else {
                    $scope.summaryFirst = design.summary;
                    $scope.summarySecond = null;
                }
            }
            stockList.currentDesign = design;
            // TODO: if admin then send event, else...
            if(stockList.adminReview) $rootScope.$broadcast('stock-car-selected');
            else $scope.openScreen('stockReview');
        };
    });
