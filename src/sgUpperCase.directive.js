(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sg.ui')
        .directive('sgUpperCase', sgUpperCase);

    sgUpperCase.$inject = ['$parse'];

    function sgUpperCase($parse) {
        return {
            require: 'ngModel',
            link: link
        };

        function link(scope, elm, attrs, modelCtrl) {
            function upperize(inputValue) {
                if (!inputValue) {
                    return inputValue;
                }
                var upperized = inputValue.toUpperCase();
                if (upperized !== inputValue) {
                    modelCtrl.$setViewValue(upperized);
                    modelCtrl.$render();
                }
                return upperized;
            }

            var model = $parse(attrs.ngModel);
            modelCtrl.$parsers.push(upperize);
            upperize(model(scope));
        }
    }

})(window, window.angular);