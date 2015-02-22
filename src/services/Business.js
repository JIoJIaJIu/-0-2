angular.module('MomAndPop.services').service('Business', [
    '$http',
    '$log',
    'utils',
    'CONFIG',
function ($http, $log, utils, CONFIG) {
    /**
     * @param {String} id
     * @param {Function} callback
     *   @param {String} err
     *   @param {Object} business
     */
    this.getBusiness = function (id, callback) {
        var URL = utils.pathJoin(CONFIG.REST_SERVICE_BASE_URL, 'businesses', id);

        $log.debug('Requesting [GET]', URL);
        $http.get(URL)
            .success(function (business) {
                callback(null, business);
            })
            .error(function (resp) {
                callback(resp && resp.error);
            });
    }

    /**
     * @param {Function} callback
     *   @param {String} err
     *   @param {Object} business
     */
    this.getMyBusiness = function (callback) {
        var URL = utils.pathJoin(CONFIG.REST_SERVICE_BASE_URL, 'businesses/me');

        $log.debug('Requesting [GET]', URL);
        $http.get(URL)
            .sucess(function (business) {
                callback(null, business);
            })
            .error(function (resp) {
                callback(resp && resp.error);
            });
    }

    /**
     * @param {Object} business
     * @param {ArrayBuffer} photo
     * @param {Function} callback
     *   @param {String} err
     *   @param {Object} business
     */
    this.updateMyBusiness = function (business, photo, callback) {
        var URL = utils.pathJoin(CONFIG.REST_SERVICE_BASE_URL, 'businesses/me');

        $log.debug('Requesting [PUT]', URL);
        $http.put(URL, business)
            .success(function (data) {
                callback(null, data);
            })
            .error(function (resp) {
                callback(resp && resp.error);
            });
    }

    /**
     * @param {Object} creditCard
     * @param {Function} callback
     *   @param {String} err
     *   @param {Object} business
     */
    this.verify = function (creditCard, callback) {
        var URL = utils.pathJoin(CONFIG.REST_SERVICE_BASE_URL, 'businesses/me/verify');

        $log.debug('Requesting [POST]', URL);
        $http.post(URL, creditCard)
            .success(function (business) {
                callback(null, business);
            })
            .error(function (resp) {
                callback(resp && resp.error);
            });
    }

    /**
     * @param {Function} callback
     *   @param {String} err
     *   @param {Array} users // mismatch with REST_API_SPECIFICATION
     */
    this.getBusinessEmployees = function (callback) {
        var URL = utils.pathJoin(CONFIG.REST_SERVICE_BASE_URL, 'businesses/me/employees');

        $log.debug('Requesting [GET]', URL);
        $http.get(URL)
            .success(function (users) {
                callback(null, users);
            })
            .error(function (resp) {
                callback(resp && resp.error);
            });
    }

    /**
     * @param {Object} user
     * @param {Function} callback
     *   @param {String} err
     */
    this.addBusinessEmployee = function (user, callback) {
        var URL = utils.pathJoin(CONFIG.REST_SERVICE_BASE_URL, 'businesses/me/employees');

        $log.debug('Requesting [POST]', URL);
        $http.post(URL, user)
            .success(function (user) {
                callback(null, user);
            })
            .error(function (resp) {
                callback(resp && resp.error);
            });
    }

    /**
     * @param {String} id
     * @param {Function} callback
     *   @param {String} err
     */
    this.deleteBusinessEmployee = function (id, callback) {
        var URL = utils.pathJoin(CONFIG.REST_SERVICE_BASE_URL, 'businesses/me/employees', id);

        $log.debug('Requesting [DELETE]', URL);
        $http.delete(URL)
            .success(function () {
                callback(null);
            })
            .error(function (resp) {
                callback(resp && resp.error);
            });
    }

    /**
     * @param {Object} user
     * @param {Function} callback
     *   @param {String} err
     *   @param {Object} user
     */
    this.updateBusinessEmployee = function (user, callback) {
        var URL = utils.pathJoin(CONFIG.REST_SERVICE_BASE_URL, 'businesses/me/employees', id);

        $log.debug('Requesting [PUT]', URL);
        $http.put(URL, user)
            .success(function (user) {
                callback(null, user);
            })
            .error(function (resp) {
                callback(resp && resp.error);
            });
    }
}]);
