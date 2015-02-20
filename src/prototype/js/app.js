'use strict';

var app = angular.module("projectApp",["ngRoute","controllers","projectServices","directive","ngDropdowns","filters","flow", "infinite-scroll", 'LocalStorageModule']);

// Initialize the main module
app.run(['$rootScope', '$location', '$window', function ($rootScope, $location,  $window) {
    $rootScope.location = $location;
    $rootScope.goto = function (path) {
        $rootScope.isExpand = false;
        if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        }else { // Go to the specified path
            $location.path(path);
        }
    };
}]);

app.config(["$routeProvider",
    function($routeProvider){
        $routeProvider
			.when("/",{
                templateUrl: "partials/Home.html",
				controller: 'homeCtrl'
            })
			.when("/Login",{
                templateUrl: "partials/Login.html",
				controller: 'loginCtrl'
            })
			.when("/ChampionMyInfo",{
                templateUrl: "partials/ChampionMyInfo.html",
				controller: 'championMyInfoCtrl'
            })
			.when("/ChampionMyFounder$hares",{
                templateUrl: "partials/ChampionMyFounder$hares.html",
				controller: 'championMyFounder$haresCtrl'
            })
			.when("/ChampionMyHistory",{
                templateUrl: "partials/ChampionMyHistory.html",
				controller: 'championMyHistoryCtrl'
            })
			.when("/PostCards",{
                templateUrl: "partials/PostCards.html",
				controller: 'postCardsCtrl'
            })
			.when("/FounderMyInfo",{
                templateUrl: "partials/FounderMyInfo.html",
				controller: 'founderMyInfoCtrl'
            })
			.when("/FounderMyHistory",{
                templateUrl: "partials/MyHistory.html",
				controller: 'founderMyHistoryCtrl'
            })
			.when("/FounderMyEmployees",{
                templateUrl: "partials/FounderMyEmployees.html",
				controller: 'MyEmployeesCtrl'
            })
			.when("/ReportAbuse",{
                templateUrl: "partials/ReportAbuse.html",
				controller: 'reportAbuseCtrl'
            })
			.when("/ProvideFeedback",{
                templateUrl: "partials/ProvideFeedback.html",
				controller: 'provideFeedbackCtrl'
            })
			.when("/Payment",{
                templateUrl: "partials/Payment.html",
				controller: 'paymentCtrl'
            })
			.when("/VerifyAccount",{
                templateUrl: "partials/VerifyAccount.html",
				controller: 'verifyAccountCtrl'
            })
			.when("/PlatEmployeeMyInfo",{
                templateUrl: "partials/PlatEmployeeMyInfo.html",
				controller: 'platEmployeeMyInfoCtrl'
            })
			.when("/ShoppingCart",{
                templateUrl: "partials/ShoppingCart.html",
				controller: 'shoppingCartCtrl'
            })
			.when("/FounderStatus",{
                templateUrl: "partials/FounderStatus.html",
				controller: 'founderStatusCtrl'
            })
			.when("/Founder$hares",{
                templateUrl: "partials/Founder$hares.html",
				controller: 'founder$haresCtrl'
            })
			.when("/FounderF$Posting",{
                templateUrl: "partials/FounderF$Posting.html",
				controller: 'founderF$PostingCtrl'
            })
			.when("/Register",{
                templateUrl: "partials/Register.html",
				controller: 'registerCtrl'
            })
			.when("/ResetPassword",{
                templateUrl: "partials/ResetPassword.html",
				controller: 'resetPasswordCtrl'
            })
			.when("/ForgotPassword",{
                templateUrl: "partials/ForgotPassword.html",
				controller: 'forgotPasswordCtrl'
            })
			
			//==================//
			.when('/HowItWorks', {
                templateUrl: 'partials/HowItWorks.html'
            })
			.when('/About', {
                templateUrl: 'partials/About.html'
            })
            .when('/Forums', {
                templateUrl: 'partials/Forums.html'
            })
            .when('/Blog', {
                templateUrl: 'partials/Blog.html'
            })
            .when('/Faq', {
                templateUrl: 'partials/Faq.html'
            })
			.when('/Copyright', {
                templateUrl: 'partials/Copyright.html'
            })
			.when('/PrivacyPolicy', {
                templateUrl: 'partials/PrivacyPolicy.html'
            })
			.when('/TermsAndConditions', {
                templateUrl: 'partials/TermsAndConditions.html'
            })
			.when('/VerifyPDFForm', {
                templateUrl: 'partials/VerifyPDFForm.html'
            })
			//==================//
			
            .otherwise({
                redirectTo: '/'
            });
    }
])