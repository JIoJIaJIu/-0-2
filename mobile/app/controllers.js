'use strict';

var appControllers = angular.module('MomAndPop.controllers', []);

// Header controller
appControllers.controller('header', ['$scope', function ($scope) {
    $scope.global.menuOpened = false;
}]);


// Main menu controller
appControllers.controller('menu', ['$scope', '$http', function ($scope, $http) {
    function calculateGauge(percent) {
        if (percent >= 100) {
            percent = 99;
        }
        $scope.gauge = {
            x: 32 + 29 * Math.sin(2 * Math.PI * percent / 100),
            y: 32 - 29 * Math.cos(2 * Math.PI * percent / 100),
            largeFlag: percent >= 50 ? 1 : 0
        };
    }

    function changeUser(data) {
        $scope.user = data;
        if (data) {
            calculateGauge(data.redeemed || 0);
            var menu = 'menuChampion.json';
            if (data.kind === 'employee') {
                menu = 'menuEmployee.json';
            }

            $http.get('data/' + menu).success(function (data) {
                $scope.menu = data;
            });
        }
    }

    $scope.menuClicked = function () {
        $scope.global.menuOpened = false;
    };
    $scope.$watch('global.user', changeUser, true);
}]);


// Home page controller
appControllers.controller('homePage', ['$scope', '$http', function ($scope, $http) {
    $scope.resetGlobal({
        title: 'My Founder$hares',
        userProfile: 'user.json'
    });

    $http.get('data/businesses.json').success(function (data) {
        $scope.businesses = data.businesses;
    });

    $scope.setOrder = function (order) {
        $scope.order = order;
        var field, orderMore = 1;
        switch (order.type) {
            case 'name-asc':
                field = 'name';
                break;
            case 'name-desc':
                field = 'name';
                orderMore = -1;
                break;
            case 'amount':
                field = 'amount';
                break;
        }
        $scope.businesses.sort(function (b1, b2) {
            if (b1[field] < b2[field]) { return -orderMore; }
            if (b1[field] > b2[field]) { return orderMore; }
            return '';
        });
    };
}]);

// Search controller
appControllers.controller('search', ['$scope', '$location', function ($scope, $location) {
    $scope.mode = 'order';
    $scope.orders = [
        {
            "type": "name-asc",
            "title": "A-Z"
        },
        {
            "type": "name-desc",
            "title": "Z-A"
        },
        {
            "type": "amount",
            "title": "Amount"
        }
    ];

    $scope.setMode = function(mode) {
        $scope.mode = mode;
        $scope.search = '';
        if (mode === 'searching') {
            setTimeout(function () {
                $('.search .input').focus();
            }, 0);
        }
    };

    $scope.checkEnter = function($event) {
        if ($event.keyCode === 13) {
            $scope.doSearch();
        }
    };

    $scope.doSearch = function () {
        if ($scope.search) {
            $location.path('/search/' + $scope.search);
        }
    };
}]);


// Home page controller
appControllers.controller('searchPage', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.resetGlobal({
        title: 'Search Results',
        userProfile: 'user.json',
        back: 'home'
    });

    $scope.query = $routeParams.query;

    $http.get('data/businesses.json').success(function (data) {
        var query = ($scope.query || '').toLowerCase();
        $scope.businesses = data.businesses.filter(function (business) {
            return business.name.toLowerCase().indexOf(query) >= 0;
        });
    });
}]);



// Details page controller
appControllers.controller('detailsPage', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.resetGlobal({
        userProfile: 'user.json',
        title: 'Details',
        back: 'home'
    });

    function initMaps() {
        // Check google maps api already loaded
        if ($('#google-maps-script').length) {
            loadMap();
            return;
        }

        // Map api load callback
        window.initializeGoogleMaps = function () {
            delete window.initializeGoogleMaps;
            loadMap();
        };

        // Load google maps api
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'google-maps-script';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=initializeGoogleMaps';
        document.body.appendChild(script);
    }

    function loadMap () {
        var lat = 0,
            lng = 0;

        if ($scope.business && $scope.business.address.position) {
            lat = $scope.business.address.position.lat;
            lng = $scope.business.address.position.lng;
        }

        var mapPosition = new google.maps.LatLng(lat, lng);
        var mapCanvas = $('.map-canvas').get(0);
        var mapOptions = {
            center: mapPosition,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(mapCanvas, mapOptions);
        var marker = new google.maps.Marker({
            position: mapPosition,
            icon: 'i/marker.png',
            map: map
        });
    }

    $http.get('data/businesses.json').success(function (data) {
        data.businesses.some(function (business) {
            if (business.id.toString() === $routeParams.id) {
                $scope.business = business;
                return true;
            }
        });

        initMaps();
    });
}]);


// Redeem page controller
appControllers.controller('redeemPage', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.resetGlobal({
        title: 'Display QR',
        userProfile: 'user.json',
        back: 'home'
    });

    $http.get('data/businesses.json').success(function (data) {
        data.businesses.some(function (business) {
            if (business.id.toString() === $routeParams.id) {
                $scope.business = business;
                $scope.redeem = business.redeem[$routeParams.redeemId] || business.redeem[0];
                return true;
            }
        });
    });
}]);


// Privacy page controller
appControllers.controller('privacyPage', ['$scope', function ($scope) {
    $scope.resetGlobal();

    $scope.global.title = 'Privacy Policy';
    $scope.source = 'partials/privacy.html';
}]);


// Terms page controller
appControllers.controller('termsPage', ['$scope', function ($scope) {
    $scope.resetGlobal();

    $scope.global.title = 'Terms & Conditions';
    $scope.source = 'partials/terms.html';
}]);


// Abuse page controller
appControllers.controller('abusePage', ['$scope', '$modal', '$location', function ($scope, $modal, $location) {
    $scope.resetGlobal();

    $scope.global.title = 'Report Abuse';
    $scope.sendIssue = function () {
        // post abuse issue to the backend
        var abuse = {
            issue: $scope.issue,
            description: $scope.issueDescription
        };

        var modalInstance = $scope.showInformation('Your report has been sent. \nYou\'ll be notified by email when this is solved.');

        modalInstance.result.then(function () {
            $location.path($scope.getHome());
        });
    };
}]);

// Business home controller
appControllers.controller("businessHomePage", function ($scope, $location, $rootScope) {
    $scope.resetGlobal({
        title: 'Redeem Founder$hares',
        userProfile: 'employee.json'
    });
});

// Business step 1 controller
appControllers.controller("businessStep1Page", function ($scope, $location, $rootScope) {
    $scope.resetGlobal({
        title: 'Redeem Founder$hares',
        userProfile: 'employee.json'
    });

    $scope.global.redeemAmount = 0;

    // continue
    $scope.continueToNext = function () {
        if ($scope.stepOneForm.redeemAmount.$invalid) {
            $scope.validateErrorMsg = 'The amount to be redeemed from the Founder$hare is invalid';
            $scope.showError = true;
        }
        else {
            $scope.global.redeemAmount = $scope.redeemAmount;
            $location.path("/business-step-2");
        }
    };

    // focus input, clear error
    $scope.focusInput = function() {
        $scope.validateErrorMsg = '';
        $scope.showError = false;
    };

});

// Business step 2 controller
appControllers.controller('businessStep2Page', ['$rootScope', '$scope', '$interval', '$http', '$location', function ($rootScope, $scope, $interval, $http, $location) {
    $scope.resetGlobal({
        title: 'Redeem Founder$hares',
        userProfile: 'employee.json'
    });

    // Camera QR code capture routine
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

    // Post QR code to backend
    function postQRCode () {
        // The follow code is to post QR photo to backend. It is replaced fake code scan for a while.
        //var formData = new FormData(document.forms['qr-post-form']);
        //$http({
        //        method: 'POST',
        //        url: '/',
        //        data: formData,
        //        headers: { 'Content-Type': 'multipart/form-data' }
        //    })
        //    .success(function () {
        //
        //    });
        $scope.scannedQR = 'qr code';
        $scope.$apply();
    }

    // Check browser support getUserMedia function
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    $scope.userMedia = Boolean(navigator.getUserMedia);
    if ($scope.userMedia) {
        videoCapture();
    } else {
        $('#camera-input').on('change', function () {
            postQRCode();
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


// Modal dialog controller
appControllers.controller('modalCtrl', function ($scope, $modalInstance, text) {
    $scope.text = text;
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.yes = function () {
        $modalInstance.close();
    };

    $scope.no = function () {
        $modalInstance.dismiss();
    };
});

//Login Controller
appControllers.controller("loginCtrl", function ($scope, $location, $rootScope) {
    //Validate
    $scope.resetGlobal({
        headless: true,
        userProfile: 'unauthorized.json'
    });

    $scope.validate = function () {
        if (!$scope.username || !$scope.password) {
            $scope.validation = false;
        } else {
            $scope.validation = ($scope.username && $scope.password === '123456');
        }
        if ($scope.validation) {
            $rootScope.login = $scope.username === 'buz' ? 'employee.json' : 'user.json';
            $location.path($scope.username === 'buz' ? '/business-home' : '/individual-home');
        } else {
            $scope.showError = true;
        }
    };

    // clear validation error, while focus  in input boxes;
    $scope.clearValidateError = function () {
        $scope.showError = false;
    };

    $scope.toggleRememberMe = function () {
        if ($scope.isRememberMe) {
            $scope.isRememberMe = false;
        }
        else {
            $scope.isRememberMe = true;
        }
    };
});

//sign Up Champion Controller
appControllers.controller("signUpChooseAccountPage", function ($scope, $location, $rootScope) {
    $scope.resetGlobal({
        headless: true,
        userProfile: 'unauthorized.json'
    });
});

/**
 * Add check confirm password function to $scope.
 * @param $scope  $scope have password and confirmPassword to be checked.
 */
function checkConfirmPassword($scope) {
    // check  confirm password matches password
    $scope.checkConfirmPassword = function () {
        return  $scope.password === $scope.confirmPassword &&
            ($scope.password !== undefined )
            && ($scope.confirmPassword !== undefined )
            && ( $scope.password.length > 0 && $scope.confirmPassword.length > 0 );
    };
}


// put common methods of signUpChampionCtrl and signUpFounderCtrl
function signUpUtil($scope, $location, $rootScope) {
    var requiredFields = $scope.requiredFields;
    // toggle accept terms and conditions
    $scope.toggleAcceptTerms = function () {
        if ($scope.isAcceptTerms) {
            $scope.isAcceptTerms = false;
        }
        else {
            $scope.isAcceptTerms = true;
        }
    };

    // set upload browser button and upload file text field.
    document.getElementById("uploadBtn").onchange = function () {
        document.getElementById("uploadFile").value = this.value;
        var path = this.value;
        // just show file name
        var fileName = path.replace(/.*\\/, '');
        fileName = fileName.replace(/.*\//, '');
        document.getElementById("uploadFile").value = fileName;
    };

    // return whether accept term is checked and .
    $scope.isAcceptTermUnCheck = function () {
        return  !$scope.isAcceptTerms;
    };


    checkConfirmPassword($scope);
    // return whether  disable register button.
    $scope.isDisableRegister = function () {
        return  !$scope.isAcceptTerms || $scope.signUpForm.$invalid || !$scope.checkConfirmPassword();
    };

    $scope.validateErrorMsg = "";

    // tool function for validate form data
    $scope.validateUtil = function () {
        $scope.validateErrorMsg = "";

        var requiredFieldNotFilled = [];
        $.each(requiredFields, function (index, item) {
            if ($scope.signUpForm[ item.fieldName ] &&
                $scope.signUpForm[ item.fieldName ].$error.required) {
                requiredFieldNotFilled.push(item.describeName);
                $("input[name=" + item.fieldName + "]").addClass('invalid')
            }
        });

        if (requiredFieldNotFilled.length > 0) {
            // show error
            $scope.showError = true;
            for (var i = 0; i < requiredFieldNotFilled.length; i++) {
                $scope.validateErrorMsg += requiredFieldNotFilled[i];
                // last element
                if (i == requiredFieldNotFilled.length - 1) {
                    if (requiredFieldNotFilled.length == 1) {
                        $scope.validateErrorMsg += ' is required. ';
                    }
                    else {
                        $scope.validateErrorMsg += ' are required. ';
                    }
                }
                else {
                    $scope.validateErrorMsg += ', ';
                }
            }
        }


        // confirm password  not match
        if (!$scope.checkConfirmPassword()) {
            $scope.validateErrorMsg += 'Confirm password is not same as password.';
            $scope.showError = true;
        }

        // confirm password  not match
        if ($scope.signUpForm.mail.$dirty && $scope.signUpForm.mail.$invalid) {
            $scope.validateErrorMsg += 'Email is invalid.';
        }

        $scope.afterClickRegister = true;


        // if  validate pass, alert message and redirect to login page.
        if( $scope.signUpForm.$valid && $scope.checkConfirmPassword())
        {
            $rootScope.showInformation('You have successfully registered!').result
                .then(
                    function () { $location.path('/'); },
                    function () { $location.path('/'); }
                );
        }
    };

    // focus input
    $scope.focusInput = function () {
        // if just right after click register, clear error message.
        if ($scope.afterClickRegister) {
            $scope.showError = false;
            $scope.validateErrorMsg = "";
            $scope.afterClickRegister = false;
            // clear all warning border
            $("input").removeClass('invalid');
        }
    };

    /**
     *
     * Tool function for signUpForm, when loose focus, validate input value
     * @param $event   jquery event
     */
    $scope.looseFocusUtil = function ($event) {
        $scope.showError = false;
        var fieldName = $($event.target).attr('name');
        // check required rule
        if ($scope.signUpForm[ fieldName ].$error.required) {
            $scope.showError = true;
            $scope.validateErrorMsg = requiredFields[fieldName].describeName + " is required";
            $("input[name=" + fieldName + "]").addClass('invalid');
        }
        else {
            // has input required field, remove error style.
            $("input[name=" + fieldName + "]").removeClass('invalid');

            // mail input have values but not correct.
            if ($scope.signUpForm.mail.$dirty && $scope.signUpForm.mail.$invalid) {
                $scope.showError = true;
                $scope.validateErrorMsg = "Email address is invalid";
                $("input[name='mail']").addClass('invalid');
            }
            // if mail has valid input value remove error style.
            else if ($scope.signUpForm.mail.$valid) {
                $("input[name='mail']").removeClass('invalid');
            }
        }
    };

    $scope.afterClickRegister = false;

    $scope.$watch('$scope.signUpForm.mail.$invalid', function () {
        // if mail change to valid, remove red border.
        if ($scope.signUpForm.mail.$valid) {
            $("input[name='mail']").removeClass('invalid');
        }
    })
}

//sign Up Champion Controller
appControllers.controller("signUpChampionCtrl", function ($scope, $location, $rootScope) {
    $scope.resetGlobal({
        headless: true,
        userProfile: 'unauthorized.json'
    });

    $scope.requiredFields = {
        firstName: { fieldName: 'firstName',
            describeName: 'First Name'
        },
        lastName: { fieldName: 'lastName',
            describeName: 'Last Name'
        },
        mail: {  fieldName: 'mail',
            describeName: 'Email Address'
        },
        password: {
            fieldName: 'password',
            describeName: 'Password'
        },
        confirmPassword: {
            fieldName: 'confirmPassword',
            describeName: 'Confirm Password'
        }
    };

    // reset modal
    signUpUtil($scope, $location, $rootScope);
    $scope.validate = $scope.validateUtil;
    $scope.looseFocus = $scope.looseFocusUtil;
    $scope.global.user.home = '/sign-up-champion';
});

//sign up founder Controller
appControllers.controller("signUpFounderCtrl", function ($scope, $location, $rootScope) {
    $scope.resetGlobal({
        headless: true,
        userProfile: 'unauthorized.json'
    });

    $scope.requiredFields = {
        bizName: { fieldName: 'bizName',
            describeName: 'Business Name'
        },
        bizFirstName: { fieldName: 'bizFirstName',
            describeName: 'Biz First Name'
        },
        bizLastName: { fieldName: 'bizLastName',
            describeName: 'Biz Last Name'
        },
        mail: {  fieldName: 'mail',
            describeName: 'Email Address'
        },
        password: {
            fieldName: 'password',
            describeName: 'Password'
        },
        confirmPassword: {
            fieldName: 'confirmPassword',
            describeName: 'Confirm Password'
        }
    };
    // reset modal
    signUpUtil($scope, $location, $rootScope);
    $scope.validate = $scope.validateUtil;
    $scope.looseFocus = $scope.looseFocusUtil;
    $scope.global.user.home = '/sign-up-founder';
});

// resetPasswordCtrl
appControllers.controller("resetPasswordCtrl", function ($scope, $location, $rootScope) {
    $scope.resetGlobal({
        headless: true,
        userProfile: 'unauthorized.json'
    });

    // reset alert box
    $scope.validateErrorMsg = "";
    // tool function for validate form data
    $scope.validate = function () {
        // clear error message
        $scope.validateErrorMsg = "";
        if ($scope.resetPasswordForm["mail" ] && $scope.resetPasswordForm["mail"].$error.required) {
            $(".form-group").addClass('invalid');
            $scope.validateErrorMsg += 'Email is required.';
        }


        if ($scope.resetPasswordForm.mail.$dirty && $scope.resetPasswordForm.mail.$invalid) {
            $(".form-group").addClass('invalid');
            $scope.validateErrorMsg += 'Email is invalid.';
        }
        // show error
        if ($scope.validateErrorMsg.length > 0) {
            $scope.showError = true;
        }
    };

    // validate before submit
    $scope.submitValidate = function () {
        $scope.validate();
        if ($scope.resetPasswordForm.$valid) {
            $rootScope.showInformation('Password reset link has been sent to your email.\nKindly follow URL link to reset password.')
                .result.then(
                    function () { $location.path('/'); },
                    function () { $location.path('/'); }
                );
        }
    };

    // focus input
    $scope.focusInput = function () {
        $scope.showError = false;
        $scope.validateErrorMsg = "";
        // clear all warning border
        $(".form-group").removeClass('invalid')
    };

    $scope.$watch('$scope.resetPasswordForm.mail.$invalid', function () {
        // if mail change to valid, remove red border.
        if ($scope.resetPasswordForm.mail.$valid) {
            $(".form-group").removeClass('invalid');
        }
    })
});


// reset password step two controller
appControllers.controller("resetPasswordStepTwoCtrl", function ($scope, $location) {
    $scope.resetGlobal({
        headless: true
    });

    $scope.validateErrorMsg = "";

    var requiredFields = {
        password: {
            fieldName: 'password',
            describeName: 'New Password'
        },
        confirmPassword: {
            fieldName: 'confirmPassword',
            describeName: 'Confirm Password'
        }
    };

    // add check confirm password function to $scope.
    checkConfirmPassword($scope);

    // tool function for validate form data
    $scope.validate = function () {
        $scope.validateErrorMsg = "";

        var requiredFieldNotFilled = [];
        $.each(requiredFields, function (index, item) {
            if ($scope.resetPasswordForm[ item.fieldName ] &&
                $scope.resetPasswordForm[ item.fieldName ].$error.required) {
                requiredFieldNotFilled.push(item.describeName);
                $("input[name=" + item.fieldName + "]").closest('.form-group').addClass('invalid')
            }
        });

        if (requiredFieldNotFilled.length > 0) {
            for (var i = 0; i < requiredFieldNotFilled.length; i++) {
                $scope.validateErrorMsg += requiredFieldNotFilled[i];
                // last element
                if (i == requiredFieldNotFilled.length - 1) {
                    if (requiredFieldNotFilled.length == 1) {
                        $scope.validateErrorMsg += ' is required. ';
                    }
                    else {
                        $scope.validateErrorMsg += ' are required. ';
                    }
                }
                else {
                    $scope.validateErrorMsg += ', ';
                }
            }
        }

        // confirm password  not match
        if (!$scope.checkConfirmPassword()) {
            $scope.validateErrorMsg += 'Confirm password is not same as password.';
        }

        if ($scope.resetPasswordForm.$invalid) {
            $scope.showError = true;
        }
        else {
            $location.path('/');
        }

        $scope.afterClickSubmit = true;
    };

    // focus input
    $scope.focusInput = function () {
        // if just right after click "reset password", clear error message, when user focus in input.
        if ($scope.afterClickSubmit) {
            $scope.showError = false;
            $scope.validateErrorMsg = "";
            $scope.afterClickSubmit = false;
            // clear all warning border
            $(".form-group").removeClass('invalid')
        }
    };

    /**
     *
     * Function for resetPasswordForm, when loose focus, validate input value
     * @param $event   jquery event
     */
    $scope.looseFocus = function ($event) {
        $scope.showError = false;
        var fieldName = $($event.target).attr('name');
        // check required rule
        if ($scope.resetPasswordForm[ fieldName ].$error.required) {
            $scope.showError = true;
            $scope.validateErrorMsg = requiredFields[fieldName].describeName + " is required";
            $("input[name=" + fieldName + "]").closest('.form-group').addClass('invalid');
        }
        else {
            $("input[name=" + fieldName + "]").closest('.form-group').removeClass('invalid');
        }
    };

});
