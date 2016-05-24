/* global angular */
angular.module('carwars').
    factory('stockList', function(server) {
        "use strict";
        return {
            criteria: null,
            name: null,
            offset: 0,
            results: null,
            nameSearch: false,
            currentDesign: null,
            adminReview: false,

            clear: function() {
                this.criteria = null;
                this.name = null;
                this.offset = 0;
                this.results = null;
                this.nameSearch = false;
                this.currentDesign = null;
                this.adminReview = false;
            },

            setNameSearch: function(byName) {
                if((byName && !this.nameSearch) || (!byName && this.nameSearch)) {
                    this.results = null;
                    this.criteria = null;
                    this.name = null;
                }
                this.nameSearch = byName;
            },

            checkExistingResults: function() {
                return this.results && this.results.designs.length > 0;
            },

            setCriteria: function(body, tags, encumbrance, techLevel) {
                this.criteria = {
                    body: body,
                    tags: tags,
                    encumbrance: encumbrance,
                    techLevel: techLevel
                };
                this.name = null;
                if(this.nameSearch) this.results = null;
                this.nameSearch = false;
                this.offset = 0;
                return this.hasCriteria();
            },

            setName: function(name) {
                this.criteria = null;
                this.name = name;
                if(!this.nameSearch) this.results = null;
                this.nameSearch = true;
                this.offset = 0;
            },

            hasCriteria: function() {
                return this.criteria && (this.criteria.body.length > 0 || this.criteria.tags.length > 0
                    || this.criteria.encumbrance || this.criteria.techLevel);
            },

            executeSearch: function(success, failure) {
                var service = this;
                var wrapper = function(data) {
                    service.results = data;
                    success(data);
                };
                if(this.nameSearch)
                    return server.searchByName(this.name, this.offset, wrapper, failure);
                else
                    return server.searchStockCars(null, this.offset, this.criteria.body, this.criteria.tags,
                        this.criteria.techLevel, null, null, this.criteria.encumbrance, wrapper, failure);
            },

            searchRecent: function(success, failure) {
                var service = this;
                return server.recentStockCars(function(data) {
                    service.results = data;
                    success(data);
                }, failure);
            }
        };
    });
