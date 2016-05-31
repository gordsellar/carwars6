/*
 Car Wars is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games.
 All rights are reserved by Steve Jackson Games.

 This game aid is the original creation of Aaron Mulder and is released for free distribution, and not for resale,
 under the permissions granted in the Steve Jackson Games Online Policy.

 Application code for this game aid (except for the Car Wars rules as noted above) copyright 2014 Aaron Mulder.
 */
/* global angular, CW */

(function() {
    "use strict";

    angular.module('carwars')
        .config(function ($routeProvider) {
            $routeProvider
                .when('/overview', {
                    templateUrl: 'views/overview.html',
                    controller: 'OverviewCtrl',
                    title: 'Design Overview'
                })
                .when('/body', {
                    templateUrl: 'views/body.html',
                    controller: 'BodyCtrl',
                    title: 'Body Options'
                })
                .when('/crewList', {
                    templateUrl: 'views/crew-list.html',
                    controller: 'CrewListCtrl',
                    title: 'All Crew'
                })
                .when('/crew', {
                    templateUrl: 'views/crew.html',
                    controller: 'CrewCtrl',
                    title: 'Crew Member'
                })
                .when('/crewGear', {
                    templateUrl: 'views/crew-gear.html',
                    controller: 'CrewGearCtrl',
                    title: 'Personal Weapons & Equipment'
                })
                .when('/crewGearList', {
                    templateUrl: 'views/crew-gear-list.html',
                    controller: 'CrewGearListCtrl',
                    title: 'Personal Equipment Selection'
                })
                .when('/handWeaponCategories', {
                    templateUrl: 'views/crew-weapon-categories.html',
                    controller: 'HandWeaponCategoriesCtrl',
                    title: 'Hand Weapons Types'
                })
                .when('/handWeaponList', {
                    templateUrl: 'views/crew-weapon-list.html',
                    controller: 'HandWeaponListCtrl',
                    title: 'Hand Weapon Selection'
                })
                .when('/handWeapon', {
                    templateUrl: 'views/crew-weapon.html',
                    controller: 'HandWeaponCtrl',
                    title: 'Customize Hand Weapon'
                })
                .when('/tireList', {
                    templateUrl: 'views/tire-list.html',
                    controller: 'TireListCtrl',
                    title: 'All Tires'
                })
                .when('/tire', {
                    templateUrl: 'views/tire.html',
                    controller: 'TireCtrl',
                    title: 'Tires in Location'
                })
                .when('/engineList', {
                    templateUrl: 'views/engine-list.html',
                    controller: 'EngineListCtrl',
                    title: 'Engine List'
                })
                .when('/engine', {
                    templateUrl: 'views/engine.html',
                    controller: 'EngineCtrl',
                    title: 'Edit Engine/Power Plant'
                })
                .when('/gasTank', {
                    templateUrl: 'views/gas-tank.html',
                    controller: 'GasTankCtrl',
                    title: 'Gas Tank'
                })
                .when('/performanceMods', {
                    templateUrl: 'views/performance.html',
                    controller: 'PerformanceModsCtrl',
                    title: 'Performance Modifications'
                })
                .when('/bodyMods', {
                    templateUrl: 'views/body-mods.html',
                    controller: 'BodyModsCtrl',
                    title: 'Body Modifications'
                })
                .when('/turretList', {
                    templateUrl: 'views/turret-list.html',
                    controller: 'TurretListCtrl',
                    title: 'Turrets'
                })
                .when('/turret', {
                    templateUrl: 'views/turret.html',
                    controller: 'TurretCtrl',
                    title: 'Edit Turret'
                })
                .when('/weaponLocations', {
                    templateUrl: 'views/weapon-locations.html',
                    controller: 'WeaponLocationsCtrl',
                    title: 'All Weapons'
                })
                .when('/weaponLocation', {
                    templateUrl: 'views/weapon-location.html',
                    controller: 'WeaponLocationCtrl',
                    title: 'Weapons in Location'
                })
                .when('/weaponTypes', {
                    templateUrl: 'views/weapon-categories.html',
                    controller: 'WeaponCategoriesCtrl',
                    title: 'Weapon Types'
                })
                .when('/weaponList', {
                    templateUrl: 'views/weapon-list.html',
                    controller: 'WeaponListCtrl',
                    title: 'Weapon List'
                })
                .when('/weapon', {
                    templateUrl: 'views/weapon.html',
                    controller: 'WeaponCtrl',
                    title: 'Configure Weapon'
                })
                .when('/ammo', {
                    templateUrl: 'views/ammo.html',
                    controller: 'AmmoCtrl',
                    title: 'Configure Ammunition'
                })
                .when('/armorType', {
                    templateUrl: 'views/armor-type.html',
                    controller: 'ArmorTypeCtrl',
                    title: 'Select Armor Type'
                })
                .when('/gearTypes', {
                    templateUrl: 'views/gear-categories.html',
                    controller: 'GearCategoriesCtrl',
                    title: 'Accessories'
                })
                .when('/gearList', {
                    templateUrl: 'views/gear-list.html',
                    controller: 'GearListCtrl',
                    title: 'Available Accessories'
                })
                .when('/hitch', {
                    templateUrl: 'views/hitch.html',
                    controller: 'HitchCtrl',
                    title: 'Tow Hitch'
                })
                .when('/cargo', {
                    templateUrl: 'views/cargo.html',
                    controller: 'CargoCtrl',
                    title: 'Cargo Reservation'
                })
                .when('/booster', {
                    templateUrl: 'views/booster.html',
                    controller: 'BoosterCtrl',
                    title: 'Rocket Boosters & Jump Jets'
                })
                .when('/armor', {
                    templateUrl: 'views/armor.html',
                    controller: 'ArmorCtrl',
                    title: 'Assign Armor'
                })
                .when('/linkList', {
                    templateUrl: 'views/link-list.html',
                    controller: 'LinkListCtrl',
                    title: 'Links'
                })
                .when('/link', {
                    templateUrl: 'views/link.html',
                    controller: 'LinkCtrl',
                    title: 'Configure Link'
                })
                .when('/design', {
                    templateUrl: 'views/design.html',
                    controller: 'DesignCtrl',
                    title: 'Configure Design'
                })
                .when('/dischargers', {
                    templateUrl: 'views/discharger-dialog.html',
                    controller: 'DischargerCtrl',
                    title: 'Configure Design'
                })
                .when('/mainMenu', {
                    templateUrl: 'views/main-menu.html',
                    controller: 'MainMenuCtrl',
                    title: 'Main Menu'
                })
                .when('/createAccount', {
                    templateUrl: 'views/account-create.html',
                    controller: 'CreateAccountCtrl',
                    title: 'Create Account'
                })
                .when('/confirmAccount', {
                    templateUrl: 'views/account-confirm.html',
                    controller: 'ConfirmAccountCtrl',
                    title: 'Confirm Account'
                })
                .when('/login', {
                    templateUrl: 'views/login-dialog.html',
                    controller: 'LoginCtrl',
                    title: 'Login'
                })
                .when('/designList', {
                    templateUrl: 'views/designs-dialog.html',
                    controller: 'DesignListCtrl',
                    title: 'My Designs'
                })
                .when('/save', {
                    templateUrl: 'views/save.html',
                    controller: 'SaveCtrl',
                    title: 'Save Design'
                })
                .when('/saveStock', {
                    templateUrl: 'views/save-stock.html',
                    controller: 'SaveStockCtrl',
                    title: 'Save Stock Car'
                })
                .when('/confirmSave', {
                    templateUrl: 'views/save-confirm.html',
                    controller: 'ConfirmSaveCtrl',
                    title: 'Design Saved'
                })
                .when('/share', {
                    templateUrl: 'views/share.html',
                    controller: 'ShareDesignCtrl',
                    title: 'Share Design'
                })
                .when('/stock', {
                    templateUrl: 'views/stock-browse.html',
                    controller: 'StockBrowseCtrl',
                    title: 'Browse Stock Cars'
                })
                .when('/stockReview', {
                    templateUrl: 'views/stock-review.html',
                    controller: 'StockReviewCtrl',
                    title: 'Stock Car'
                })
                .when('/stl', {
                    templateUrl: 'views/stl.html',
                    controller: 'STLOptionsCtrl',
                    title: '3D Printing Options'
                })
                .when('/adminMenu', {
                    templateUrl: 'admin/views/menu.html',
                    controller: 'AdminMenuCtrl',
                    title: 'Admin Menu'
                })
                .when('/adminReview', {
                    templateUrl: 'admin/views/stock-review.html',
                    controller: 'AdminReviewStockCtrl',
                    title: 'Review Stock Cars'
                })
                .when('/adminRegenerate', {
                    templateUrl: 'admin/views/regenerate.html',
                    controller: 'AdminRegenCtrl',
                    title: 'Regenerate Vehicles'
                });
        })
        .run(function ($rootScope) {
            $rootScope.showTitle = function () {
                if ($rootScope.pageTitle) return " - " + $rootScope.pageTitle;
                return "";
            };
            $rootScope.$on("$locationChangeStart", function (event, nextURL, currentURL) {
                if (!$rootScope.started) {
                    event.preventDefault();
                }
            });
            $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
                if (currentRoute)
                    $rootScope.pageTitle = currentRoute.$$route.title;
            });
        });
})();
