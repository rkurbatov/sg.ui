// Directive for setting element size in percents of viewport
// Used as: <img class='sg-viewport-size' vw='100' vh='20'/>
(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sg.ui')
        .directive('sgViewportSize', sgViewportSize);

    sgViewportSize.$inject = ['$window'];

    function sgViewportSize($window) {

        return {
            restrict: 'C',
            link: link
        };

        function link(scope, elm, attrs) {
            console.log(attrs);
            angular.element($window).on('load resize', setElementSize);

            scope.$on('$destroy', function () {
                angular.element(window).off('load resize', setElementSize);
            });

            function setElementSize() {
                if (attrs.vw && !isNaN(attrs.vw) && attrs.vw >= 0) {
                    elm.width($window.innerWidth * attrs.vw / 100);
                } else {
                    console.error('Bad element width!');
                }

                if (attrs.vh && !isNaN(attrs.vh) && attrs.vh >= 0) {
                    elm.height($window.innerHeight * attrs.vh / 100);
                } else {
                    console.error('Bad element height!');
                }
            }
        }
    }

})(window, window.angular);