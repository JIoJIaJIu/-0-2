(function (undefined) {

angular.module('projectApp').controller('homeCtrl', [
    '$scope',
    '$log',
    'GiftCardOffer',
    'Business',
    'fakeAuth',
function ($scope, $log, GiftCardOffer, Business) {
    $scope.Home = {
        pageNumber: 0,
        pageSize: 0,
        result: [],
        selectedOffer: null,
        comments: null,
        myComment: null,
        business: null,
        friendEmail: null
    };

    $scope.search = function () {
        GiftCardOffer.search(null, function (err, data) {
            if (err) {
                alert(err)
                return;
            }

            $scope.Home.result = data.items;
        });
    }

    $scope.selectOffer = function () {
    }

    $scope.emailToFriend = function () {
    }

    $scope.postComment = function () {
    }

    $scope.addToShoppingCart = function () {
    }

    $scope.selectOffer = function (offer) {
        $scope.display = true;
        $scope.item = offer;

        Business.getBusiness(offer.businessId, function (err, business) {
            if (err) {
                return;
            }

            console.log(business);
        });


        GiftCardOffer.getComments(offer.id, function (err, comments) {
            if (err) {
                return;
            }

            console.log(comments);
        });
    }

    $scope.search();
}]);

})();
