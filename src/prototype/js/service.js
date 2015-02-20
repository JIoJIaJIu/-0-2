'use strict';

/* Services */

var projectServices = angular.module('projectServices', ['ngResource']);

//factory for Data
projectServices.factory('DataService', ['$http', '$q', function ($http, $q) {
    return {
        query : function(fileName) {
            var deferred = $q.defer();
            $http({method: 'GET', url: 'data/'+fileName+'.json'}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function(data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
    };
}]);