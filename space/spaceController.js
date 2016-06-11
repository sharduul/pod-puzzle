(function(){
	'use strict';

	angular
		.module('space-controllers', [])
		.controller('spaceController', SpaceController);

    SpaceController.$inject = ['spaceResource', '$sce'];

	function SpaceController(spaceResource, $sce){
		var vm = this;
        var organizations = [];

        vm.searchText = "";
        vm.filteredOrganizations = [];

        vm.filter = filter;
        vm.highlight = highlight;
        vm.reset = reset;


		(function(){

            spaceResource.space().get(function(data){
                organizations = data;
                vm.filteredOrganizations = data;
                console.log(data);
            });

		})();


        function reset(){
            vm.searchText = "";
            vm.filteredOrganizations = organizations;
        }

        function filter(){

            vm.searchText = vm.searchText.toLowerCase();
            vm.filteredOrganizations = [];

            if(!vm.searchText){
                vm.filteredOrganizations = organizations;
                return;
            }

            _.forEach(organizations, function(organizationItem){

                if(organizationItem.name.toLowerCase().indexOf(vm.searchText) > -1){
                    vm.filteredOrganizations.push(organizationItem);
                }
                else{
                    var tempOrg = _.clone(organizationItem);
                    tempOrg.spaces = [];
                    var match = false;

                    _.forEach(organizationItem.spaces, function(spaceItem){
                        if(spaceItem.name.toLowerCase().indexOf(vm.searchText) > -1){
                            tempOrg.spaces.push(spaceItem);
                            match = true;
                        }
                    })

                    if(match){
                        vm.filteredOrganizations.push(tempOrg);
                    }
                }

            });
        }


        function highlight(text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }
            return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
        };


	}

})();