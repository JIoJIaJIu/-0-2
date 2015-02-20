'use strict';

var directive = angular.module("directive", []);

//Only Number
directive.directive('numbersOnly', function(){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl){
			modelCtrl.$parsers.push(function(inputValue){
				if(inputValue === undefined) return '';
				var transformedInput = inputValue.replace(/[^0-9+]/g, ''); 
				if(transformedInput!=inputValue){
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
				}
				return transformedInput;         
			});
		}
	};
});

//Only Dollar
directive.directive('dollarOnly', function(){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl){
			modelCtrl.$parsers.push(function(inputValue){
				if(inputValue === undefined) return '' 
				var transformedInput = inputValue.replace(/[^0-9.$+]/g, ''); 
				if(transformedInput!=inputValue){
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
				}
				return transformedInput;         
			});
		}
	};
});

directive.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}]);


//Max Number
directive.directive('maxNumber', function(){
	return {
		require: 'ngModel',
		scope:{
			max: '=maxNumber',
			model: '=ngModel'
		},
		link: function(scope, element, attrs, modelCtrl){
			element.on('keyup', function(){
				scope.$apply(function () {
					if(scope.model > scope.max){
						scope.model = scope.max;
					}
                });
			});
		}
	};
});


// set percent progress bar for gift card
directive.directive('progress', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModelCtrl) {
            var val = attrs['progress'].split(',');
            var progress = isNaN(Number(val[0])) ? 0 : Number(val[0]);
            var aProgress = isNaN(Number(val[1])) ? 0 : Number(val[1]);
            var percent = (progress/2500)*100;
            var rotageElement1 = element.find('.circle .mask.full');
            var rotageElement2 = element.find('.circle .fill');
            rotageElement1.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
            rotageElement2.css('transform', 'rotate(' + percent * 1.9 + 'deg)');
        }
    }
});

// set position for modal
directive.directive('initModal', function ($window) {
    return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
            var w = angular.element($window);
            var mt = (w.height()-element.height())/2;
            element.css({'margin-top': mt})
        }
    }
});
