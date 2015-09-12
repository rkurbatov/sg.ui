// changes style of element for some amount of time
// attributes:
// delay (0) - starting delay before first blick, seconds
// speed (200) - speed in pxs per second
// interval (10) - interval between blicks, seconds
// random (0) - random deviation border number for intervals, seconds
(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sg.ui')
        .directive('sgBlick', sgBlick);

    sgBlick.$inject = ['$window', '$timeout', '$interval'];

    function sgBlick($window, $timeout, $interval) {

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, elm, attrs) {
            var delay = attrs.delay || 0;
            var speed = attrs.speed || 200;         // blick speed in pxs per second
            var interval = attrs.interval || 10;    // blick every 10s
            var random = attrs.random
                ? (attrs.random === '' ? 1 : attrs.random)
                : 0;
            var duration;

            var elmWidth = 0;

            angular.element($window).on('load resize', setElmWidth);

            scope.$on('$destroy', function () {
                angular.element($window).off('load resize', setElmWidth);
            });

            function setElmWidth() {
                elmWidth = elm.width();
            }

            // random interval = interval (in s) +/- random value < random attr (in s)
            // converted to ms
            var rndInterval = (interval + random * (Math.random() * 2 - 1)) * 1000;

            // set blick time depending on speed param and element length
            scope.$watch(
                function () {
                    return elmWidth;
                },
                function (newWidth, oldWidth) {
                    if (newWidth && newWidth !== oldWidth) {
                        duration = newWidth / speed;
                        elm.css('transition-duration', duration + "s");
                    }
                });

            $timeout($interval(cbBlick, rndInterval), delay);

            function cbBlick() {
                // set style to 'hovered' for
                elm.toggleClass('sg-blick');
                setTimeout(function () {
                    elm.toggleClass('sg-blick')
                }, Number(duration * 1000));
            }
        }
    }

})(window, window.angular);