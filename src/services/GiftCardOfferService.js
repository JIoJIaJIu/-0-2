define(['config'], function (config) {

angular.module(config.moduleName).service('GiftCardOffer', [
    '$log',
function ($log) {
    /** 
     * Creating offer
     *
     * @param {Object} offer
     * @param {Function} callback
     *   @param {Error} err
     *   @param {Object} offer
     */
    this.create = function (offer, callback) {
    }

    /**
     * @param {} criteria
     * @param {Function} callback
     *   @param {Error} err
     *   @param {Array} result, array of offers
     */
    this.search = function (criteria, callback) {
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
     * @param {String} id
     * @param {Function} callback
     */
    this.getComments = function () {
    }
}]);

});
