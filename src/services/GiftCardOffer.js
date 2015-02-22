angular.module('MomAndPop.services').service('GiftCardOffer', [
    '$http',
    '$log',
    'CONFIG',
    'utils',
function ($http, $log, CONFIG, utils) {
    /** 
     * Creating offer
     *
     * @param {Object} offer
     * @param {Function} callback
     *   @param {String} err
     */
    this.create = function (offer, callback) {
    }

    /**
     * @param {Object} [criteria]
     *   @key {Number} pageSize
     *   @key {Number} pageNumber
     *   @key {String} [sortBy]
     *   @key {String} [sortOrder]
     *   @key {String} [businessName]
     *   @key {String} [businessType]
     *   @key {String} [businessAddress]
     *   @key {Array} [discountRange], array of numbers
     *   @key {Array} [dateRange], array of datetimes
     *   @key {String} [description]
     *   @key {Array} [statuses], array of strings
     *   @key {Array} [availableQuantityRange], array of numbers
     *   @key {Array} [coordinates], array of numbers
     * @param {Function} callback
     *   @param {String} err
     *   @param {Object} resp
     *      @key {Number} totalPage
     *      @key {Number} pageNumber
     *      @key {Number} totalRecords
     *      @key {Array} items
     */
    this.search = function (criteria, callback) {
        var URL = utils.pathJoin(CONFIG.REST_SERVICE_BASE_URL, 'giftCardOffers');

        $log.debug('Requesting [GET]', URL);
        $http.get(URL, criteria)
            .success(function (resp) {
                callback(null, resp);
            })
            .error(function (resp) {
                callback(resp && resp.error);
            })
    }

    /**
     * Getting offer by id
     *
     * @param {String} id
     * @param {Function} callback
     *   @param {Error} err
     *   @param {Object} offer
     */
    this.get = function (id, callback) {
    }

    /**
     * @param {Array} ids
     * @param {Function} callback
     *   @param {Error} err
     *   @param {Array} result, array of offers
     */
    this.getGiftCardOffers = function (ids, callback) {
    }

    /**
     * @param {String} id
     * @param {Function} callback
     *   @param {Error} err
     */
    this.delete = function () {
    }

    /**
     * @param {Object} offer
     * @param {Function} callback
     */
    this.update = function () {
    }

    /**
     * @param {String} id
     * @param {Function} callback
     */
    this.cancel = function () {
    }

    /**
     * @param {String} id
     * @param {Function} callback
     */
    this.getOwners = function () {
    }

    /**
     * @param {Object} card
     * @param {Function} callback
     */
    this.purchase = function () {
    }

    /**
     * @param {String} id
     * @param {Object} comment
     * @param {Function} callback
     */
    this.addComment = function () {
    }

    /**
     * @param {String} offerId
     * @param {String} commendId
     * @param {Function} callback
     */
    this.removeComment = function () {
    }

    /**
     * @param {String} offerId
     * @param {Function} callback
     *   @param {String} err
     *   @param {Array} comments
     */
    this.getComments = function (offerId, callback) {
        var URL = utils.pathJoin(CONFIG.REST_SERVICE_BASE_URL, 'giftCardOffers', offerId, 'comments');

        $log.debug('Requesting [GET]', URL);
        $http.get(URL)
            .success(function (resp) {
                callback(null, resp);
            })
            .error(function (resp) {
                callback(resp && resp.error);
            })
    }
}]);
