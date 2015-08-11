(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sg.ui')
        .directive('sgLowerCase', sgLowerCase);

    sgLowerCase.$inject = ['$parse'];

    function sgLowerCase($parse) {
        return {
            require: 'ngModel',
            link: link
        };

        function link(scope, elm, attrs, modelCtrl) {
            function lowerize(inputValue) {
                if (!inputValue) {
                    return inputValue;
                }
                var lowerized = inputValue.toLowerCase();
                if (lowerized !== inputValue) {
                    modelCtrl.$setViewValue(lowerized);
                    modelCtrl.$render();
                }
                return lowerized;
            }

            var model = $parse(attrs.ngModel);
            modelCtrl.$parsers.push(lowerize);
            lowerize(model(scope));
        }
    }

})(window, window.angular);