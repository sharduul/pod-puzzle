(function(){
    'use strict';

    angular
        .module('app', ['ui.router', 'ui.bootstrap', 'ngResource', 'ngMessages'])
        .config(Config)
        .run(Run);

    Config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];
    Run.$inject = ['$rootScope'];

    function Run($rootScope){

        // this event is fired whenever there is change of route state
        $rootScope.$on('$stateChangeStart',  function(e, stateData) {

        });
    }

    function Config($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('space', {
                url: "/space",
                templateUrl: "space/space.html",
                //controller: "spaceController as space"
            })
            .state('space.overview', {
                url: "/:spaceId",
                templateUrl: "space/overview/spaceOverview.html",
                //controller: "spaceOverviewController as spaceOverview"
            })
            .state('not-authorized', {
                url: "/not-authorized",
                templateUrl: "templates/notAuthorized.html"
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/not-authorized');
    }

})();