'use strict';

/* Controller */

var controllers = angular.module("controllers",[]);

//Main Controller
controllers.controller("mainCtrl",function($scope,$rootScope, DataService, $location,  localStorageService ){
	$rootScope.modal = false;

		// store role of user had login
        $scope.startLogin = false;
        $scope.hadLogin = false;

        // store search data
        $scope.search = {};

		var rootRole =  localStorageService.get("role");
		if(!rootRole) $scope.role = null;
		else $scope.role = rootRole;
		
        $scope.select = {item: 0};
        $scope.router = function(endpoint) {
        	if(endpoint == '0') {
        		$scope.partial = endpoint
        		return;
        	}
		    $location.path("/" + ($scope.partial = endpoint));
		};

        // starting login
        $scope.authorization = function() {
        	if(!$scope.hadLogin) {
        		$scope.startLogin = true;
        	} else {
        		$scope.startLogin = false;
        		$scope.hadLogin = false;
        		$location.path('/Home');
        	}
        };

        // mock up login
	    $scope.login = function(role, buyGift) {
	    	enableScroll();
	    	$scope.startLogin = false;
	    	$scope.hadLogin = true;
			$scope.role = role;
			localStorageService.set("role", role);
	    	if(buyGift) {
	    		$location.path('/ShoppingCart');
	    	}else{
				switch(role){
					case "Founder": 
						$location.path('/Founder$hares');
						break;
					case "Champion":
						$location.path('/ChampionMyFounder$hares');
						break;
					case "Employee":
						$location.path('/FounderStatus');
						break;
					default:
				}
			}
	    };

	    // mock up add to card
	    $scope.addToCard = function () {
	    	if($scope.hadLogin) {
	    		$location.path('/ShoppingCart');
	    	} else {
	    		$scope.startLogin = true;
	    		disableScroll();
	    	}
	    };

	    // get role
	    $scope.isVisible = function(items) {
	    	var roles = items.split(',');
	    	for(var index in roles) {
	    		if(roles[index] == $scope.role)
	    			return true;
	    	}
	    	return false;
	    };
		
		//logout
		$scope.logout = function() {
	    	localStorageService.set("role", null);
			$location.path('/Login');
			$scope.role = null;
	    };
		
		//go to my profile
		$scope.goUser = function() {
			var role = localStorageService.get("role");
			
			switch(role){
				case "Founder": 
					$location.path('/Founder$hares');
					break;
				case "Champion":
					$location.path('/ChampionMyFounder$hares');
					break;
				case "Employee":
					$location.path('/FounderStatus');
					break;
				default:
			}
        };

	    // disable scroll of body when login box show
	    function disableScroll() {
	    	angular.element('body').addClass('hide-body');
	    }
	    // ebable scroll of body when login box show
	    function enableScroll() {
	    	angular.element('body').removeClass('hide-body');
	    }
        
        var StaticURLsPromise = DataService.query('StaticPageUrl');
	        StaticURLsPromise.then(function(data) {
	            $scope.staticUrls = data.urls;
	        }, function(data) {});

});

//Login Controller
controllers.controller('loginCtrl', ['$scope',
    function ($scope) {
		
	}
]);

//Home Controller
controllers.controller('homeCtrl', ['$scope', 'DataService', '$timeout',
    function ($scope, DataService, $timeout) {
        $scope.pause = false;
        $scope.check = false;
        // display view details
    	$scope.display = false;
  		$scope.showInfo = function(item){
  			$scope.display = true;
  			$scope.arrayList = item;
  		};

        // close view details
  		$scope.closeInfo = function () {
  			$scope.display = false;
  		};

  		// add comment
  		$scope.checkComment = function(){
  			$scope.check = true;
  		};

        // data content Home
	    var HomePromise = DataService.query('Home');
	        HomePromise.then(function(data) {
	            $scope.Home = data;
                if(window.location.hash.indexOf('search')!== -1) {
                    $scope.Home.title = "Search Result";
                }
	        }, function(data) {});

	    // mock up infinite scroll
	    $scope.loadMore = function() {
	    	if($scope.search.name != undefined && $scope.search.name != '') return;
	    	if($scope.Home && $scope.Home.listItem.length <= 24 && !$scope.pause) {
		    	$scope.pause = true;
		    	$timeout(function () {
			    	for(var i = 0; i < 4; i++) {
		    			$scope.Home.listItem.push(angular.copy($scope.Home.more));
		    		}
		    		$scope.pause = false;
		    	}, 800);
		    }
	    };
	}
]);

//championMyFounder$hares Controller
controllers.controller('championMyFounder$haresCtrl', ['$scope', 'DataService', '$timeout',
    function ($scope, DataService, $timeout) {
		
        $scope.pause = false;

        // open file dialog
        $scope.openFileDialog = function (elementName) {
        	angular.element('#' + elementName)[0].click();
        };

        // data content MyCart
	    var MyCartPromise = DataService.query('MyCart');
	        MyCartPromise.then(function(data) {
	            $scope.MyCart = data;
	        }, function(data) {});

	        
	    $scope.user = {item: 0};
	    $scope.activeButton = {item: 1};
	    $scope.show = "show";

	    // mock up infinite scroll
	    $scope.loadMore = function() {
	    	if($scope.MyCart && $scope.MyCart.listItem.length <= 30 && !$scope.pause) {
		    	$scope.pause = true;
		    	$timeout(function () {
				    	for(var i = 0; i < 5; i++) {
			    			$scope.MyCart.listItem.push(angular.copy($scope.MyCart.more));
			    		}
			    		$scope.pause = false;
		    	}, 800);
		    }
	    };

	    $scope.showAddNew = false;

    	$scope.startAddNew = function () {
    		$scope.showAddNew = true;
    	};

	         //add item
        $scope.addItem = function (source, object) {
            object.push(angular.copy(source));
            $scope.showAddNew = false;
        };
        
        //delete Custom Site
	    $scope.delete = function (index, object) {
	        if (index > -1) {
	            object.splice(index, 1);
	        }
	    };
	    // init when page loaded
	    function init() {
			$scope.user.item = 1;
	    }
	    init();
		
	}
]);

//postCards Controller
controllers.controller("postCardsCtrl",function($scope,DataService,$rootScope){
	$rootScope.modal = false;
	//Get History
	//$rootScope.role = 'Founder';
	var promise = DataService.query("postCard");
	promise.then(function(data){
		$scope.post = data.post;
		//Set Dropdown
		$scope.myOptions = [
			{
				name: 'Adventure',
				value: 'Adventure'
			},
			{
				name: 'Food & Drink',
				value: 'Food & Drink'
			},
			{
				name: 'Flying',
				value: 'Flying'
			}
		];
		$scope.business_type = {
			name: $scope.post[0].businessType,
			value: $scope.post[0].businessType
		}
		//Save
		$scope.save = function(){
			if($scope.form.$valid){
				$scope.saveModal = $scope.modal = true;
			}
		}
		//Done
		$scope.done = function(){
			$scope.saveModal = $scope.modal = false;	
		}
		//Post
		$scope.postNow = function(){
			if($scope.form.$valid){
				$scope.postModal = $scope.modal = true;
			}
		}
		//Close Modal
		$scope.closeModal = function(){
			$scope.postModal = $scope.saveModal = $scope.modal = false;	
		}
	},function(data){});
});

//championMyInfo Controller
controllers.controller('championMyInfoCtrl', ['$scope', '$rootScope', 'DataService',
    function ($scope, $rootScope, DataService) {

        $rootScope.modal = false;
        //$rootScope.role = 'Employee';
        $scope.uploader = {};

        $scope.businessType = [
            {
                name: 'Champion',
                value: 'Champion'
            },
            {
                name: 'Business Owner',
                value: 'Business Owner'
            }
        ];

        //Get Info
        var promise = DataService.query("info");
        promise.then(function(data){
            $scope.Myinfo = data;
            $scope.Editinfo = jQuery.extend(true, {}, data);
        },function(data){});
        $scope.save = function(){
            $scope.Myinfo = jQuery.extend(true, {}, $scope.Editinfo);
            if ($scope.uploader.flow.files[0]) {
                $scope.Editinfo.photo.describe = $scope.Myinfo.photo.describe = $scope.uploader.flow.files[0].name;
            }
            $scope.uploader.flow.files = [];
        };
        
        $scope.cancel = function() {
            $scope.Editinfo = jQuery.extend(true, {}, $scope.Myinfo);
            $scope.uploader.flow.files = [];
        };
        
        $scope.password = "123456";
        $scope.clonepassword = "123456";
		$scope.cancelPassword = function(){
			$scope.password = $scope.clonepassword;
            $scope.newpassword = $scope.confirmpassword = "";
			$scope.switchPassword = false;
		};
		$scope.savePassword = function(){
			$scope.submitted = true;
			if($scope.passwordForm.password_confirm.$valid && $scope.passwordForm.password_new.$valid){
                $scope.clonepassword = $scope.password = $scope.passwordForm.password_new.$modelValue;
				$scope.switchPassword = false;
			}
		};
	}
]);

//founderMyInfoCtrl Controller
controllers.controller('founderMyInfoCtrl', ['$scope', '$rootScope', 'DataService', 
    function ($scope, $rootScope, DataService) {
        $rootScope.modal = false;
        //$rootScope.role = 'Employee';
        $scope.uploader = {};

        $scope.businessType = [
            {
                name: 'Champion',
                value: 'Champion'
            },
            {
                name: 'Business Owner',
                value: 'Business Owner'
            }
        ];
        $scope.feedback_type = {
            name: 'Question',
            value: 'Question'
        };

        //Get Info
        var promise = DataService.query("info");
        promise.then(function(data){
            $scope.Myinfo = data;
            $scope.Editinfo = jQuery.extend(true, {}, data);
        },function(data){});
        $scope.save = function(){
            $scope.Myinfo = jQuery.extend(true, {}, $scope.Editinfo);
            if ($scope.uploader.flow.files[0]) {
                $scope.Editinfo.logo.describe = $scope.Myinfo.logo.describe = $scope.uploader.flow.files[0].name;
            }
            $scope.uploader.flow.files = [];
        };

        $scope.cancel = function() {
            $scope.Editinfo = jQuery.extend(true, {}, $scope.Myinfo);
            $scope.uploader.flow.files = [];
        };
        
        $scope.password = "123456";
        $scope.clonepassword = "123456";
		$scope.cancelPassword = function(){
			$scope.password = $scope.clonepassword;
            $scope.newpassword = $scope.confirmpassword = "";
			$scope.switchPassword = false;
		};
		$scope.savePassword = function(){
			$scope.submitted = true;
			if($scope.passwordForm.password_confirm.$valid && $scope.passwordForm.password_new.$valid){
                $scope.clonepassword = $scope.password = $scope.passwordForm.password_new.$modelValue;
				$scope.switchPassword = false;
			}
		};
    }
]);


//My History Controller
controllers.controller("championMyHistoryCtrl",function($scope,DataService,$rootScope){
	$rootScope.modal = false;
	//Get History
	var promise = DataService.query("championHistory");
	promise.then(function(data){
		$scope.historyList = data.history;
		//$rootScope.role = 'Champion';
	},function(data){});
});

controllers.controller("founderMyHistoryCtrl",function($scope,DataService,$rootScope){
	$rootScope.modal = false;
	//Get History
	var promise = DataService.query("founderHistory");
	promise.then(function(data){
		$scope.historyList = data.history;
		//$rootScope.role = 'Founder';
	},function(data){});
});

//My Employees Controller
controllers.controller("MyEmployeesCtrl",function($scope,DataService,$rootScope){
	$rootScope.modal = false;
	//Get Employees
	//$rootScope.role = 'Founder';
	var promise = DataService.query("employees");
	promise.then(function(data){
		$scope.employeesList = data.employees;
		angular.forEach($scope.employeesList,function(employees,index){
			angular.extend(employees,{'flag' : false , 'nameEmpty' : false , 'passwordEmpty': false});
		});
		//Add
		$scope.add = function(){
			var item = {
				"name": "",
				"password": "",
				"flag": true,
				"nameEmpty": "",
				"passwordEmpty": ""
			}
			$scope.employeesList.push(item);
		}
		//Modify
		$scope.modify = function(idx){
			$scope.employeesList[idx].flag = true;
		};
		//Save
		$scope.save = function(idx){
			if($scope.employeesList[idx].name && $scope.employeesList[idx].password){
				$scope.employeesList[idx].flag = 
				$scope.employeesList[idx].passwordEmpty = 
				$scope.employeesList[idx].nameEmpty = false;
			}else{
				if(!$scope.employeesList[idx].name){
					$scope.employeesList[idx].nameEmpty = true;
				}
				if(!$scope.employeesList[idx].password){
					$scope.employeesList[idx].passwordEmpty = true;
				}
			}
		};
		//Delete
		$scope.remove = function(idx){
			$scope.employeesList.splice(idx, 1);
		};
	},function(data){});
});

//Report Abuse Controller
controllers.controller("reportAbuseCtrl",function($scope,$rootScope){
	$rootScope.modal = false;
	//$rootScope.role = 'Founder';
	$scope.submitQuery = function(){
		$scope.submitted = true;
		if($scope.abuseForm.$valid){
			$scope.reportModal = $rootScope.modal = true;
		}
	}
	$scope.submit = $scope.submitQuery;
	//Close Modal
	$scope.done = function(){
		$scope.submitted = $scope.reportModal = $rootScope.modal = false;
	}
	$scope.closeModal = function(){
		$scope.submitted = $scope.reportModal = $rootScope.modal = false;
	}
});

//Provide Feedback
controllers.controller("provideFeedbackCtrl",function($scope,$rootScope){
	$rootScope.modal = false;
	$scope.myOptions = [
		{
			name: 'Question',
			value: 'Question'
		},
		{
			name: 'Problem',
			value: 'Problem'
		},
		{
			name: 'Other',
			value: 'Other'
		}
	];
	$scope.feedback_type = {
		name: 'Question',
		value: 'Question'
	};
	$scope.submit = function(){
		$scope.submitted = true;
	};
});

//Payment
controllers.controller("paymentCtrl",function($scope,$rootScope, $location, localStorageService){
	$rootScope.modal = false;
	$scope.userRole = localStorageService.get("role");
	var currentYear = new Date().getFullYear();
    $scope.years = new Array();
    for (var i = currentYear; i< currentYear+20; i++) {
        $scope.years.push({
            name: i,
            value: i
        });
    }
	$scope.months = [
		{
			name: 'month',
			value: 'month'
		},
		{
			name: '1',
			value: '1'
		},
		{
			name: '2',
			value: '2'
		},
		{
			name: '3',
			value: '3'
		},
		{
			name: '4',
			value: '4'
		},
		{
			name: '5',
			value: '5'
		},
		{
			name: '6',
			value: '6'
		},
		{
			name: '7',
			value: '7'
		},
		{
			name: '8',
			value: '8'
		},
		{
			name: '9',
			value: '9'
		},
		{
			name: '10',
			value: '10'
		},
		{
			name: '11',
			value: '11'
		},
		{
			name: '12',
			value: '12'
		}
	];
	$scope.select_year = {
		name: 'year',
		value: 'year'
	}
	$scope.select_month = {
		name: 'month',
		value: 'month'
	}
    $scope.done = function(){
        $scope.modal = false;	
    };
	$scope.submit = function(){
		$scope.submitted = true;
		if($scope.form.$valid){
			//Done
            $scope.modal = true;
		}
	};
});

//My Info Controller
controllers.controller("platEmployeeMyInfoCtrl",function($scope, DataService, $rootScope){
	$rootScope.modal = false;
	$scope.password = "123456";
    $scope.clonepassword = "123456";
    $scope.cancelPassword = function(){
        $scope.password = $scope.clonepassword;
        $scope.newpassword = $scope.confirmpassword = "";
        $scope.switchPassword = false;
    };
    $scope.savePassword = function(){
        $scope.submitted = true;
        if($scope.passwordForm.password_confirm.$valid && $scope.passwordForm.password_new.$valid){
            $scope.clonepassword = $scope.password = $scope.passwordForm.password_new.$modelValue;
            $scope.switchPassword = false;
        }
    };
});

//Shopping Cart Controller
controllers.controller("shoppingCartCtrl",function($scope,DataService,$rootScope, $location, localStorageService){
	$rootScope.modal = false;
	//Get Shopping Cart
	var promise = DataService.query("cart");
    
	promise.then(function(data){
		$scope.cartList = data.carts;
		$scope.price = [];
		$scope.total = 0;
		for(var i=0;i<$scope.cartList.length;i++){
			$scope.price.push(Math.round(Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)*100)/100);
			$scope.total += Math.round(Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)*100)/100;
		}
		$scope.reflash = function(){
			$scope.total = 0;
			$scope.price = [];
			$scope.validate = [];
			for(var i=0;i<$scope.cartList.length;i++){
				//Validate
				if(Number($scope.cartList[i].value.replace('$','')) <= $scope.cartList[i].available){
					$scope.validate.push(false);
					if(!isNaN(Math.round(Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)*100)/100)){
						$scope.price.push((Number($scope.cartList[i].value.replace('$','')) * (1 - $scope.cartList[i].discount)).toFixed(2));
					}else{
						$scope.price.push('0');	
					}
					$scope.total += $scope.price[i];	
					$scope.total = Math.round($scope.total*100)/100;
				}else{
					$scope.price.push('0');
					$scope.total += $scope.price[i];	
					$scope.total = Math.round($scope.total*100)/100;
					$scope.validate.push(true);	
				}
			}
		}
		//Pay
		$scope.pay = function(){
			var role = localStorageService.get("role");
			console.log(role);
			if(!role){
				$rootScope.modal = $scope.unLoginModal = true;
			}else{
				$location.path("/Payment");
			}
		}
		//Close
		$scope.cancel = function(){
			$rootScope.modal = $scope.unLoginModal = false;
		}
		//Delete
		$scope.delete = function(id){
			for(var i=0;i<$scope.cartList.length;i++){
				$scope.cartList.splice(i,1);
			}	
			$scope.reflash();
		}
		$scope.closeModal = function(){
			$rootScope.modal = $scope.unLoginModal = false;
		}
	},function(data){});
});

//Founder Status Controller
controllers.controller("founderStatusCtrl",function($scope,DataService,$rootScope){
	$rootScope.modal = false;
	//$rootScope.role = 'Employee';
	//Get Founder Status
	var promise = DataService.query("founder");
	promise.then(function(data){
		$scope.founderList = data.founder;
		$scope.founderList[0].active = true;
		$scope.active = function(idx){
			for(var i=0;i<$scope.founderList.length;i++){
				$scope.founderList[i].active = false;	
			}
			$scope.founderList[idx].active = true;
		}
	},function(data){});
});

//Founder$hares Controller
controllers.controller("founder$haresCtrl",function($scope,DataService,$rootScope){
	$rootScope.modal = false;
	//$rootScope.role = 'Founder';
	//Get History
	var promise = DataService.query("founder$hares");
	promise.then(function(data){
		$scope.founder$hares = data.founder$hares;
	},function(data){});
});

//FounderF$Posting Controller
controllers.controller("founderF$PostingCtrl",function($scope,DataService,$rootScope){
	$rootScope.modal = false;
	//Get History
	//$rootScope.role = 'Founder';
	var promise = DataService.query("post");
	promise.then(function(data){
		$scope.post = data.post;
		//Set Dropdown
		$scope.myOptions = [
			{
				name: 'Adventure',
				value: 'Adventure'
			},
			{
				name: 'Food & Drink',
				value: 'Food & Drink'
			},
			{
				name: 'Flying',
				value: 'Flying'
			}
		];
		$scope.business_type = {
			name: $scope.post[0].businessType,
			value: $scope.post[0].businessType
		}
		//Save
		$scope.save = function(){
			if($scope.form.$valid){
				$scope.saveModal = $scope.modal = true;
			}
		}
		//Done
		$scope.done = function(){
			$scope.saveModal = $scope.modal = false;	
		}
		//Post
		$scope.postNow = function(){
			if($scope.form.$valid){
				$scope.postModal = $scope.modal = true;
			}
		}
		//Close Modal
		$scope.closeModal = function(){
			$scope.postModal = $scope.saveModal = $scope.modal = false;	
		}
	},function(data){});
});

//Register Controller
controllers.controller("registerCtrl",function($scope,$rootScope, $location){
	$rootScope.modal = true;
	$scope.accept = false;
	//Set Dropdown
	$scope.myOptions = [
		{
			name: 'Champion',
			value: 'Champion'
		},
		{
			name: 'Business Owner',
			value: 'Business Owner'
		}
	];
	//Set Dropdown
	$scope.businessNameOptions = [
		{
			name: 'Any',
			value: 'Any'
		},
		{
			name: 'Adventure',
			value: 'Adventure'
		},
		{
			name: 'Food & Drink',
			value: 'Food & Drink'
		},
		{
			name: 'Flying',
			value: 'Flying'
		}
	];
	$scope.account_type = {
		name: $scope.myOptions[0].name,
		value: $scope.myOptions[0].value
	}
	$scope.business_type = {
		name: $scope.businessNameOptions[0].name,
		value: $scope.businessNameOptions[0].value
	}
	$scope.register = function(){
		if($scope.accept){
			$scope.submitted = true;
		}
		if($scope.form.$valid && $scope.accept) {
			$rootScope.role = $scope.account_type.name;
			$rootScope.modal = false;
			$location.path("/Home");
		}
		console.log($scope.form.$valid);
		console.log($scope.accept);
	}
	$scope.closeModal = function(){
		$rootScope.modal = false;	
	}
	$scope.resetError = function(item){
		console.log(item);
		$scope.submitted = false;	
	}
	
});

//Reset Password Controller
controllers.controller("resetPasswordCtrl",function($scope,$rootScope, $location){
	$rootScope.modal = true;
	//$rootScope.role = 'Founder';
	$scope.submit = function(){
		$scope.submitted = true;
		if($scope.form.$valid) {
			$rootScope.modal = false;	
			$location.path("/Login");
		}
	}
	$scope.closeModal = function(){
		$rootScope.modal = false;	
	}
});

//Forgot Password Controller
controllers.controller("forgotPasswordCtrl",function($scope,$rootScope, $location){
	$rootScope.modal = true;
	$scope.closeModal = function(){
		$rootScope.modal = false;	
	}
	$scope.submit = function(){
		$scope.submitted = true;
		if($scope.form.$valid) {
			$rootScope.modal = false;	
			$location.path("/Login");
		}
	}
});

//Verify Account Controller
controllers.controller("verifyAccountCtrl",function($scope,$rootScope){
	$rootScope.modal = false;
});