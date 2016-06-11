(function(){
    'use strict';

    angular
        .module('app', ['ui.router', 'ngResource', 'space-controllers', 'space-services'])
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
                url: "/",
                templateUrl: "space/space.html",
                controller: "spaceController as spaceCtrl"
            })
            .state('space.spaceOverview', {
                url: "space/:spaceId",
                templateUrl: "space/overview/spaceOverview.html",
                controller: "spaceOverviewController as spaceOverviewCtrl"
            })
            .state('space.organizationOverview', {
                url: "organization/:organizationId",
                templateUrl: "space/overview/organizationOverview.html",
                controller: "organizationOverviewController as organizationOverviewCtrl"
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');
    }

})();