(function(){
    'use strict';

    angular
        .module('sg.ui')
        .directive('sgMulticolor', sgMulticolor);

    sgMulticolor.$inject = ['$timeout'];

    function sgMulticolor($timeout){
        var ddo = {
            restrict: 'C',
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {
            elm.animate({color: '#909090'}, 500);
            $timeout(function () {
                var colors = ['#ff0000', '#ffa500', '#8b4513', '#008000', '#1e80a0', '#8b008b'];
                var currentColor = colors[Math.floor(Math.random() * colors.length)];
                elm.animate({color: currentColor}, 1000);
            }, 1000);
        }
    }
})();