(function () {
    'use strict';

    // directive runs function on image load
    angular
        .module('sg.ui')
        .directive('sgOnImgError', sgOnImgError);

    sgOnImgError.$inject = ['$parse'];

    function sgOnImgError($parse) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, elm, attrs) {
            var fn = $parse(attrs.sgOnImgError);
            elm.on('error', applyFunction);

            scope.$on('$destroy', function () {
                elm.off('error', applyFunction);
            });

            function applyFunction(event) {
                scope.$applyAsync(function () {
                    fn(scope, {$event: event});
                });
            }
        }
    }

})();

