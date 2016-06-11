(function(){
	'use strict';

	angular
		.module('space-controllers', [])
		.controller('spaceController', SpaceController);

    SpaceController.$inject = ['spaceResource', '$sce'];

	function SpaceController(spaceResource, $sce){

        // declare private variables here
        var vm = this;
        var organizations = [];

        // declare vm objects here
        vm.searchText = "";
        vm.filteredOrganizations = [];

        // declare functions here
        vm.filter = filter;
        vm.highlight = highlight;
        vm.reset = reset;

		(function(){

            // get all the organizations and spaces
            spaceResource.space().get(function(data){
                organizations = data;
                vm.filteredOrganizations = data;
                console.log(data);
            });

		})();


        // resets variables when search view is closed
        function reset(){
            vm.searchText = "";
            vm.filteredOrganizations = organizations;
        }


        // function takes care of filtering logic
        function filter(){

            vm.searchText = vm.searchText.toLowerCase();
            vm.filteredOrganizations = [];


            // if there is not search text
            // show all the organizations and spaces
            if(!vm.searchText){
                vm.filteredOrganizations = organizations;
                return;
            }


            _.forEach(organizations, function(organizationItem){

                // if search text matches any organization
                // show all the spaces under it
                if(organizationItem.name.toLowerCase().indexOf(vm.searchText) > -1){
                    vm.filteredOrganizations.push(organizationItem);
                }

                // if search does not match the organization name
                // match individual spaces
                else{
                    var tempOrg = _.clone(organizationItem);
                    tempOrg.spaces = [];
                    var match = false;

                    _.forEach(organizationItem.spaces, function(spaceItem){
                        if(spaceItem.name.toLowerCase().indexOf(vm.searchText) > -1){
                            tempOrg.spaces.push(spaceItem);
                            match = true;
                        }
                    });

                    // if any space is matched
                    // show those spaces as well as the organization of it
                    if(match){
                        vm.filteredOrganizations.push(tempOrg);
                    }
                }

            });
        }


        // takes care of highlighting the matched search text with results
        // $sce service marks results as safe and can then be used by ng-bind-html directive
        function highlight(text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }
            return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
        }

	}

})();