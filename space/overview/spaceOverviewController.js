(function(){
	'use strict';

	angular
		.module('space-controllers')
		.controller('spaceOverviewController', SpaceOverviewController);

    SpaceOverviewController.$inject = ['spaceResource', '$state'];

	function SpaceOverviewController(spaceResource, $state){
		var vm = this;

        vm.spaceSummary = null;

        (function(){

            // get all the spaces and organizations
            spaceResource.space().get(function(data){
                _.forEach(data, function(organization){

                    // find the space within organization which is being viewed
                    var space = _.find(organization.spaces, { id: +$state.params.spaceId });
                    if(space){
                        vm.spaceSummary = {
                            spaceName: space.name,
                            orgName: organization.name,
                            rights: space.rights.map(function(e){ return " " + e; }).toString()
                        }
                    }

                });
            });

        })();

	}

})();