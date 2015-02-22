(function (undefined) {

angular.module('projectApp').controller('homeCtrl', [
    '$scope',
    '$log',
    '$location',
    'GiftCardOffer',
    'Business',
    'fakeAuth',
function ($scope, $log, $location, GiftCardOffer, Business, fakeAuth) {
    // fake auth
    // delete for logout
    $scope.hadLogin = true;
    var userId = fakeAuth.getUserId();

    var criteria = {};

    $scope.title = "Founder$hares";
    $scope.Home = {
        pageNumber: 0,
        pageSize: 8,
        totalPages: 0,
        result: [],
        selectedOffer: null,
        comments: null,
        myComment: null,
        business: null,
        friendEmail:  null
    }

    $scope.search = function () {
        $scope.title = "Search Results";
        criteria = {
            businessName: $scope.searched.name
        };
        criteria.pageNumber = 0;
        criteria.pageSize = $scope.Home.pageSize;

        GiftCardOffer.search(criteria, function (err, data) {
            if (err) {
                return;
            }

            $scope.Home.pageNumber = data.pageNumber;
            $scope.Home.pageSize = data.pageSize;
            $scope.Home.result = data.items;
        });
    }

    $scope.emailToFriend = function () {
        console.log('Not implemented');
    }

    $scope.postComment = function () {
        var offer = $scope.Home.selectedOffer;
        if (!offer)
            return;

        GiftCardOffer.addComment(offer.id, {
            comment: $scope.Home.myComment,
            userId: userId,
            giftCardOfferId: offer.id
        }, function (err, comment) {
            if (err)
                return;

            $scope.Home.comments.unshift(comment)
            $scope.Home.myComment = null;
        })
    }

    $scope.addToShoppingCart = function () {
        if($scope.hadLogin) {
            $location.path('/ShoppingCart');
        } else {
            $scope.startLogin = true;
            disableScroll();
        }
    }

    $scope.selectOffer = function (offer) {
        if(!$scope.hadLogin) {
            $scope.startLogin = true;
            disableScroll();
            return;
        }

        $scope.display = true;
        $scope.Home.selectedOffer = offer;

        Business.getBusiness(offer.businessId, function (err, business) {
            if (err) {
                return;
            }

            $scope.Home.business = business;
            drawMap(business.coordinates)
        });


        GiftCardOffer.getComments(offer.id, function (err, comments) {
            if (err) {
                return;
            }

            $scope.Home.comments = comments;
        });
    }

    $scope.closeOffer = function () {
        $scope.display = false;
    }

    $scope.loadMore = function () {
        if ($scope.searched.name) {
            $scope.search();
            return;
        }

        if ($scope.pause)
            return;

        var totalPages = $scope.Home.totalPages;
        var pageNumber = $scope.Home.pageNumber;

        if (totalPages && (pageNumber >= totalPages))
            return;

        criteria.pageNumber = pageNumber + 1;
        criteria.pageSize = $scope.Home.pageSize;

        $scope.pause = true;
        GiftCardOffer.search(criteria, function (err, data) {
            if (err) {
                return;
            }

            $scope.Home.pageNumber = data.pageNumber;
            $scope.Home.totalPages = data.totalPages;
            $scope.Home.result = [].concat($scope.Home.result, data.items);
            $scope.pause = false;
        });
    }

    function drawMap (coord) {
        var latlng = new google.maps.LatLng(coord[0], coord[1]);

        var opts = {
            zoom: 12,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), opts);

        var marker = new google.maps.Marker({
            position: latlng,
            map: map
        });

        var infowindow = new google.maps.InfoWindow({
            content:"Business Location"
        });

        infowindow.open(map, marker);
    }
}]);

})();
