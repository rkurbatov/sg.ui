(function () {
    'use strict';

    // directive runs function on image load
    angular
        .module('sg.ui')
        .directive('sgOnImgLoad', sgOnImgLoad);

    sgOnImgLoad.$inject = ['$parse'];

    function sgOnImgLoad($parse) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, elm, attrs) {
            var fn = $parse(attrs.sgOnImgLoad);
            elm.on('load', applyFunction);

            scope.$on('$destroy', function(){
               elm.off('load', applyFunction);
            });

            function applyFunction(event) {
                scope.$applyAsync(function () {
                    fn(scope, {$event: event});
                });
            }
        }
    }

})();

