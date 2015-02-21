angular.module('MomAndPop.services').service('GiftCard', [
    '$log',
function ($log) {
    /**
     * @param {Object} criteria
     * @param {Function} callback
     */
    this.search = function () {
    }

    /**
     * @param {String} id
     * @param {Function} callback
     */
    this.get = function () {
    }

    /**
     * @param {String} id
     * @param {Number} quantity
     * @param {String} desc
     * @param {Function} callback
     */
    this.resell = function () {
    }

    /**
     * @param {String} id
     * @param {Number} amount
     * @param {Function} callback
     */
    this.prepareForRedeem = function () {
    }

    /**
     * @param {String} qrCode
     * @param {Number} amount
     * @param {Function} callback
     */
    this.redeem = function () {
    }

    /**
     * @param {Function} callback
     */
    this.getTotalRedeemedAmount = function () {
    }
}]);
