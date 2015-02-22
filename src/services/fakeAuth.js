/**
 * Fake Auth like Founder
 */
angular.module('MomAndPop.services').service('fakeAuth', [
    '$http',
function ($http) {
    $http.defaults.headers.common.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmF0aW9uIjoxNDU2MTIyMzIzMTk2fQ.948W5m78G1XrtZN4Etsk0Bger2safzRRU9UrNVTli8w'; 

    this.logout = function () {
        $http.defaults.headers.common.Authorization = null; 
    }

    this.getUserId = function () {
        return '54da325b5489203743520c98';
    }
}]);
