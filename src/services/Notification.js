angular.module('MomAndPop.services').service('Notification', [
    '$log',
function ($log) {
    /**
     * @param {Object} feedback
     * @param {Function} callback
     */
    this.notifyAdminOfFeedback = function () {
    }

    /**
     * @param {Object} reportedAbuse
     * @param {Function} callback
     */
    this.notifyAdminOfReportedAbuse = function () {
    }

    /**
     * @param {String} email
     * @param {String} message
     * @param {Function} callback
     */
    this.notifyUserOfInvitation = function () {
    }
}]);
