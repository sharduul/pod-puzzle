(function(){
	'use strict';

	angular
		.module('space-controllers')
		.controller('organizationOverviewController', OrganizationOverviewController);

    OrganizationOverviewController.$inject = ['spaceResource', '$state'];

	function OrganizationOverviewController(spaceResource, $state){
		var vm = this;
        vm.organizationSummary = null;

        (function(){

            // get all the spaces and organizations
            spaceResource.space().get(function(data){

                // find the organization which is being viewed
                var org = _.find(data, { id: +$state.params.organizationId });
                if(org){
                    vm.organizationSummary = {
                        orgName: org.name,
                        spaces: org.spaces.map(function(e){ return " " + e.name; }).toString()
                    }
                }
            });

        })();

	}

})();