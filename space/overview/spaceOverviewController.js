(function(){
	'use strict';

	angular
		.module('space-controllers')
		.controller('spaceOverviewController', SpaceOverviewController);

    SpaceOverviewController.$inject = ['spaceResource', '$state'];

	function SpaceOverviewController(spaceResource, $state){
		var vm = this;

        vm.organizations = [];
        vm.spaceSummary = null;

        (function(){

            spaceResource.space().get(function(data){
                vm.organizations = data;

                _.forEach(vm.organizations, function(organization){

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