(function (undefined) {

var appControllers = angular.module('MomAndPop.controllers');

appControllers.controller('businessHomePage', function ($scope, $location, $rootScope) {
    $scope.resetGlobal({
        title: 'Redeem Founder$hares',
        userProfile: 'employee.json'
    });
});

appControllers.controller('businessStep1Page', function ($scope, $location, $rootScope) {
    $scope.resetGlobal({
        title: 'Redeem Founder$hares',
        userProfile: 'employee.json'
    });

    $scope.global.redeemAmount = 0;

    $scope.continueToNext = function () {
        if ($scope.stepOneForm.redeemAmount.$invalid) {
            $scope.validateErrorMsg = 'The amount to be redeemed from the Founder$hare is invalid';
            $scope.showError = true;
        } else {
            $scope.global.redeemAmount = $scope.redeemAmount;
            $location.path("/business-step-2");
        }
    };

    $scope.focusInput = function() {
        $scope.validateErrorMsg = '';
        $scope.showError = false;
    };
});

appControllers.controller('businessStep2Page', [
    '$rootScope',
    '$scope',
    '$interval',
    '$http',
    '$location',
function ($rootScope, $scope, $interval, $http, $location) {
    $scope.resetGlobal({
        title: 'Redeem Founder$hares',
        userProfile: 'employee.json'
    });

    function videoCapture() {
        // try to capture camera
        function startVideo(sourceId) {
            navigator.getUserMedia({video: {optional: [{sourceId: sourceId}]}, audio: true}, initVideoCapture, videoError);
        }

        // init video playback
        function initVideoCapture(stream) {
            try {
                localStream = stream;
                video.src = window.URL.createObjectURL(stream);
                video.play();

                // position video element in viewport
                setTimeout(function () {
                    $(video).css({'margin-top': (180 - $(video).height()) / 2});
                    timer = $interval(scan, 200);
                }, 100);

            } catch (e) {
                $scope.userMedia = false;
            }
        }

        // capture camera error
        function videoError() {
            $scope.userMedia = false;
        }

        // scan qr code
        function scan() {
            context.drawImage(video, 0, 0, 320, 360);
            try {
                qrcode.decode();
            } catch(e) {}
        }

        // qr scanned successfully
        function scanSuccess(res) {
            $interval.cancel(timer);
            $scope.scannedQR = res;
            localStream.stop();
            video.src = '';
        }

        qrcode.callback = scanSuccess;
        var video = document.getElementById('qr-reader-showcast');
        var canvas = document.getElementById('qr-canvas');
        var context = canvas.getContext('2d');
        var localStream;
        var timer;

        // use environment camera if possible
        if (typeof MediaStreamTrack !== 'undefined' && MediaStreamTrack.getSources) {
            MediaStreamTrack.getSources(function (sources) {
                var id = null;
                sources.forEach(function (sourceInfo) {
                    if (sourceInfo.kind === 'video') {
                        if (id === null) { id = sourceInfo.id; }
                        if (sourceInfo.facing === 'environment') { id = sourceInfo.id; }
                    }
                });
                startVideo(id);
            });
        } else {
            // use anything if camera selection not supported
            startVideo(null);
        }
    }

    // Check browser support getUserMedia function
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    $scope.userMedia = Boolean(navigator.getUserMedia);
    if ($scope.userMedia) {
        videoCapture();
    } else {
        var reader = new FileReader();
        reader.onload = function(e) {
            qrcode.callback = function (res) {
                $scope.scannedQR = res;
                $scope.$apply();
            }
            qrcode.decode(e.target.result);
        }

        $('#camera-input').on('change', function (e) {
            reader.readAsDataURL(e.target.files[0]);
        });
    }

    // Confirm QR code
    $scope.goConfirm = function () {
        if ($scope.scannedQR) {
            $location.path('/business-step-3');
        }
    };

}]);


// Business step 3 controller
appControllers.controller('businessStep3Page', ['$scope', '$modal', '$location', function ($scope, $modal, $location) {
    $scope.resetGlobal({
        title: 'Redeem Founder$hares',
        userProfile: 'employee.json'
    });

    $scope.amount = -$scope.global.redeemAmount;

    $scope.confirmed = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal.html',
            controller: 'modalCtrl',
            resolve: {
                text: function () { return 'The amount has been deducted successfully!'; }
            }
        });
        modalInstance.result.then(function () {
            $location.path('/business-home');
        });
    };

}]);

})();
