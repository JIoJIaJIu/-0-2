'use strict';

var filters = angular.module("filters",[]);

//Force Number
filters.filter('num', function() {
	return function(input) {
		return Number(input.replace('$',''));
	}
});

//Force Percent
filters.filter('percentage', function() {
	return function(input) {
		if(input < 0 || input > 100 || isNaN(input) || input === ''){
			return '0';
		}else{
			return input;
		}
	}
});

//Validate Date
filters.filter('endDate', function() {
	return function(input) {
		if(Date.parse(input)){
			return input;
		}else{
			return "No expiration date";	
		}
	}
});