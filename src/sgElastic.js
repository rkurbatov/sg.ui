(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sg.ui')
        .directive('sgElastic', sgElastic);

    sgElastic.$inject = ['$timeout'];
    function sgElastic($timeout) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element) {
            scope.initialHeight = scope.initialHeight || element[0].style.height;
            var resize = function () {
                element[0].style.height = scope.initialHeight;
                element[0].style.height = "" + element[0].scrollHeight + "px";
            };
            element.on("input change", resize);
            scope.$on('$destroy', function(){
                element.off("input change", resize);
            });
            $timeout(resize, 0);
        }
    }

})(window, window.angular);

