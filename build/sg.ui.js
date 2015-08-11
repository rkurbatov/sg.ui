(function () {
    'use strict';

    angular.module('sg.ui', []);

})();

(function () {
    'use strict';

    angular
        .module('sg.ui')
        .directive('sgCarousel', sgCarousel);

    sgCarousel.$inject = ['$window'];

    function sgCarousel($window) {
        var ddo = {
            restrict: 'AC',
            link: {
                pre: preLink,
                post: postLink
            }
        };

        return ddo;

        function preLink(scope, elm, attrs) {
            scope.carousel = {
                sections: [],
                sectionWidth: $window.innerWidth
            }
        }

        function postLink(scope, elm, attrs) {
            angular.element($window).on('resize', function () {
                scope.carousel.sectionWidth = $window.innerWidth;
                resizeSections(scope.carousel)
            });
            resizeSections(scope.carousel);

            function resizeSections() {
                scope.carousel.sections.forEach(function (section) {
                    //section.css('width', scope.carousel.sectionWidth);
                })
            }
        }
    }

})();


(function () {
    'use strict';

    angular
        .module('sg.ui')
        .directive('sgCarouselSection', sgCarouselSection);

    function sgCarouselSection() {
        var ddo = {
            restrict: 'AC',
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {
            if (!scope.carousel.sections) {
                scope.carousel.sections = [];
            }
            scope.carousel.sections.push(elm);
        }
    }
})();

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
            elm.on('load', function (event) {
                scope.$apply(function () {
                    fn(scope, {$event: event});
                });
            });
        }
    }

})();


(function(){
    'use strict';

    angular
        .module('sg.ui')
        .directive('sgPlate3d', sgPlate3d)
        .provider('sgPlate3dOptions', function () {
            this.options = {};

            this.$get = function () {
                return this.options;
            };

            this.setCustomEvent = function (evtName) {
                this.options.customEvent = evtName;
            };
        });

    sgPlate3d.$inject = ['$parse', '$window', 'sgPlate3dOptions'];

    function sgPlate3d($parse, $window, sgPlate3dOptions) {
        var ddo = {
            restrict: 'AC',
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {
            var bound = angular.element('#' + attrs.for)[0] || angular.element(attrs.for)[0];

            // default evets for plate redraw
            var eventString = sgPlate3dOptions.customEvent || 'load resize';
            angular.element($window).on(eventString, plateRedraw);

            scope.$watch(function(){
                return elm.attr('src');
            }, plateRedraw);

            if (bound && bound.nodeName === 'IMG') {
                angular.element(bound).on('load', plateRedraw);
            }

            function plateRedraw() {
                var coords = $parse(attrs.coords)();

                var scaleX, scaleY;

                if (bound && bound.nodeName === 'IMG') {
                    scaleX = bound.clientWidth / bound.naturalWidth;
                    scaleY = bound.clientHeight / bound.naturalHeight;
                } else {
                    scaleX = 1;
                    scaleY = 1;
                }

                var elmWidth = $parse(attrs.width)() || elm[0].clientWidth;
                var elmHeight = $parse(attrs.height)() || elm[0].clientHeight;

                var matrix = get3dMatrix(coords, elmWidth, elmHeight, scaleX, scaleY);
                elm.css('transform', 'matrix3d(' + matrix + ')');
                elm.css('transform-origin', '0 0');
            }
        }
    }

    /**
     * Creates CSS matrix3d for given array of corner coordinates
     * @param {Array} coordinates
     * @param {Number} width of object to fit
     * @param {Number} height of object to fit
     * @param {Number} scaleX of object to fit
     * @param {Number} scaleY of object to fit
     * @returns {Array}
     */
    function get3dMatrix(coordinates, width, height, scaleX, scaleY) {
        'use strict';
        function _foreach2(x, s, k, f) {
            if (k === s.length - 1) return f(x);
            var i, n = s[k], ret = new Array(n);
            for (i = n - 1; i >= 0; --i) ret[i] = _foreach2(x[i], s, k + 1, f);
            return ret;
        }

        function _dim(x) {
            var ret = [];
            while (typeof x === "object") {
                ret.push(x.length);
                x = x[0];
            }
            return ret;
        }

        function dim(x) {
            var y, z;
            if (typeof x === "object") {
                y = x[0];
                if (typeof y === "object") {
                    z = y[0];
                    if (typeof z === "object") {
                        return _dim(x);
                    }
                    return [x.length, y.length];
                }
                return [x.length];
            }
            return [];
        }

        function cloneV(x) {
            var _n = x.length, i, ret = new Array(_n);
            for (i = _n - 1; i !== -1; --i) ret[i] = x[i];
            return ret;
        }

        function clone(x) {
            return typeof x !== "object" ? x : _foreach2(x, dim(x), 0, cloneV);
        }

        function LU(A, fast) {
            var abs = Math.abs;
            fast = fast || false;
            var i, j, k, absAjk, Akk, Ak, Pk, Ai,
                max,
                n = A.length, n1 = n - 1,
                P = new Array(n);
            if (!fast) A = clone(A);
            for (k = 0; k < n; ++k) {
                Pk = k;
                Ak = A[k];
                max = abs(Ak[k]);
                for (j = k + 1; j < n; ++j) {
                    absAjk = abs(A[j][k]);
                    if (max < absAjk) {
                        max = absAjk;
                        Pk = j;
                    }
                }
                P[k] = Pk;
                if (Pk != k) {
                    A[k] = A[Pk];
                    A[Pk] = Ak;
                    Ak = A[k];
                }
                Akk = Ak[k];
                for (i = k + 1; i < n; ++i) {
                    A[i][k] /= Akk;
                }
                for (i = k + 1; i < n; ++i) {
                    Ai = A[i];
                    for (j = k + 1; j < n1; ++j) {
                        Ai[j] -= Ai[k] * Ak[j];
                        ++j;
                        Ai[j] -= Ai[k] * Ak[j];
                    }
                    if (j === n1) Ai[j] -= Ai[k] * Ak[j];
                }
            }
            return {LU: A, P: P};
        }

        function LUsolve(LUP, b) {
            var i, j,
                LU = LUP.LU,
                n = LU.length,
                x = clone(b),
                P = LUP.P,
                Pi, LUi, tmp;
            for (i = n - 1; i !== -1; --i) {
                x[i] = b[i];
            }
            for (i = 0; i < n; ++i) {
                Pi = P[i];
                if (P[i] !== i) {
                    tmp = x[i];
                    x[i] = x[Pi];
                    x[Pi] = tmp;
                }
                LUi = LU[i];
                for (j = 0; j < i; ++j) {
                    x[i] -= x[j] * LUi[j];
                }
            }
            for (i = n - 1; i >= 0; --i) {
                LUi = LU[i];
                for (j = i + 1; j < n; ++j) {
                    x[i] -= x[j] * LUi[j];
                }
                x[i] /= LUi[i];
            }
            return x;
        }

        function solve(A, b, fast) {
            return LUsolve(LU(A, fast), b);
        }

        var a = [], b = [],
            sourcePoints = [[0, 0], [width, 0], [width, height], [0, height]],
            X, matrix;

        for (var i = 0, n = sourcePoints.length; i < n; ++i) {
            var s = sourcePoints[i], t = coordinates[i].slice(0);
            t[0] *= scaleX;
            t[1] *= scaleY;
            a.push([s[0], s[1], 1, 0, 0, 0, -s[0] * t[0], -s[1] * t[0]]);
            b.push(t[0]);
            a.push([0, 0, 0, s[0], s[1], 1, -s[0] * t[1], -s[1] * t[1]]);
            b.push(t[1]);
        }

        X = solve(a, b, true);
        matrix = [
            X[0], X[3], 0, X[6],
            X[1], X[4], 0, X[7],
            0, 0, 1, 0,
            X[2], X[5], 0, 1
        ].map(function (x) {
                return Number(x.toFixed(6));
            });

        return matrix; // css matrix3d coefficients to given transformation
    }

})();


(function () {
    'use strict';

    angular
        .module('sg.ui')
        .factory('sgPreloader', sgPreloader);

    sgPreloader.$inject = ['$q', '$rootScope'];

    function sgPreloader($q, $rootScope) {

        // I manage the preloading of image objects. Accepts an array of image URLs.
        function Preloader(imageLocations) {
            // Object or array containing sources of preloaded image
            this.imageLocations = imageLocations;
            this.isLocationsArray = angular.isArray(imageLocations);

            // As the images load, we'll need to keep track of the load/error
            // counts when announing the progress on the loading.
            this.imageCount = this.isLocationsArray
                ? this.imageLocations.length
                : Object.keys(this.imageLocations).length;
            this.loadCount = 0;
            this.errorCount = 0;

            // I am the possible states that the preloader can be in.
            this.states = {
                PENDING: 1,
                LOADING: 2,
                RESOLVED: 3,
                REJECTED: 4
            };

            // I keep track of the current state of the preloader.
            this.state = this.states.PENDING;

            // When loading the images, a promise will be returned to indicate
            // when the loading has completed (and / or progressed).
            this.deferred = $q.defer();
            this.promise = this.deferred.promise;
        }

        // STATIC METHODS.
        // I reload the given images [Array] and return a promise. The promise
        // will be resolved with the array of image locations.
        Preloader.preloadImages = function (imageLocations) {
            var preloader = new Preloader(imageLocations);
            return ( preloader.load() );
        };

        // INSTANCE METHODS.
        Preloader.prototype = {
            // Best practice for "instnceof" operator.
            constructor: Preloader,
            // PUBLIC METHODS.
            // I determine if the preloader has started loading images yet.
            isInitiated: function isInitiated() {
                return ( this.state !== this.states.PENDING );
            },
            // I determine if the preloader has failed to load all of the images.
            isRejected: function isRejected() {
                return ( this.state === this.states.REJECTED );
            },
            // I determine if the preloader has successfully loaded all of the images.
            isResolved: function isResolved() {
                return ( this.state === this.states.RESOLVED );
            },
            // I initiate the preload of the images. Returns a promise.
            load: function load() {
                // If the images are already loading, return the existing promise.
                if (this.isInitiated()) {
                    return ( this.promise );
                }
                this.state = this.states.LOADING;
                // load images using array or object containing images
                if (this.isLocationsArray) {
                    for (var i = 0; i < this.imageCount; i++) {
                        this.loadImageLocation(this.imageLocations[i]);
                    }
                } else {
                    for (var key in this.imageLocations) {
                        this.loadImageLocation(this.imageLocations[key]);
                    }
                }

                // Return the deferred promise for the load event.
                return ( this.promise );
            },

            // PRIVATE METHODS.
            // I handle the load-failure of the given image location.
            handleImageError: function handleImageError(imageLocation) {
                this.errorCount++;
                // If the preload action has already failed, ignore further action.
                if (this.isRejected()) {
                    return;
                }
                this.state = this.states.REJECTED;
                this.deferred.reject(imageLocation);
            },

            // I handle the load-success of the given image location.
            handleImageLoad: function handleImageLoad(imageLocation) {
                this.loadCount++;
                // If the preload action has already failed, ignore further action.
                if (this.isRejected()) {
                    return;
                }

                // Notify the progress of the overall deferred. This is different
                // than Resolving the deferred - you can call notify many times
                // before the ultimate resolution (or rejection) of the deferred.
                this.deferred.notify({
                    percent: Math.ceil(this.loadCount / this.imageCount * 100),
                    imageLocation: imageLocation
                });

                // If all of the images have loaded, we can resolve the deferred
                // value that we returned to the calling context.
                if (this.loadCount === this.imageCount) {
                    this.state = this.states.RESOLVED;
                    this.deferred.resolve(this.imageLocations);
                }
            },

            // I load the given image location and then wire the load / error
            // events back into the preloader instance.
            // --
            // NOTE: The load/error events trigger a $digest.
            loadImageLocation: function loadImageLocation(imageLocation) {
                var preloader = this;
                // When it comes to creating the image object, it is critical that
                // we bind the event handlers BEFORE we actually set the image
                // source. Failure to do so will prevent the events from proper
                // triggering in some browsers.
                var image = $(new Image())
                    .load(function (event) {
                        // Since the load event is asynchronous, we have to
                        // tell AngularJS that something changed.
                        $rootScope.$apply(
                            function () {
                                // set loaded flag for object input parameter
                                if (!preloader.isLocationsArray) {
                                    imageLocation.loaded = true;
                                }
                                preloader.handleImageLoad(event.target.src);
                                // Clean up object reference to help with the
                                // garbage collection in the closure.
                                preloader = image = event = null;
                            }
                        );
                    })
                    .error(function (event) {
                        // Since the load event is asynchronous, we have to
                        // tell AngularJS that something changed.
                        $rootScope.$apply(
                            function () {
                                preloader.handleImageError(event.target.src);
                                // Clean up object reference to help with the
                                // garbage collection in the closure.
                                preloader = image = event = null;
                            }
                        );
                    })
                    .prop("src", this.isLocationsArray ? imageLocation : imageLocation.src);
            }
        };

        // Return the factory instance.
        return ( Preloader );
    }

})();

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