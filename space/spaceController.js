(function(){
	'use strict';

	angular
		.module('space-controllers', [])
		.controller('spaceController', SpaceController);

    SpaceController.$inject = ['spaceResource', '$sce', '$document', '$timeout', '$state'];

	function SpaceController(spaceResource, $sce, $document, $timeout, $state){

        // declare private variables here
        var vm = this;
        var organizations = [];
        var maxIndex = 0;

        // declare vm objects here
        vm.searchText = "";
        vm.filteredOrganizations = [];
        vm.highlightIndex = 0;
        vm.searchEnabled = false;

        // declare functions here
        vm.filter = filter;
        vm.highlight = highlight;
        vm.reset = reset;

		(function(){

            // get all the organizations and spaces
            spaceResource.space().get(function(data){
                organizations = data;
                vm.filteredOrganizations = data;

                indexifyResults();
            });

		})();


        // resets variables when search view is closed
        function reset(){
            vm.searchEnabled = false;
            vm.searchText = "";
            vm.filteredOrganizations = organizations;
            vm.highlightIndex = 0;
        }


        // function takes care of filtering logic
        function filter(event){

            vm.searchText = vm.searchText.toLowerCase();
            vm.filteredOrganizations = [];

            // if there is not search text
            // show all the organizations and spaces
            if(!vm.searchText){
                vm.filteredOrganizations = organizations;
            }
            else{

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


            indexifyResults();
            vm.highlightIndex = 0;
        }


        function indexifyResults(){

            var index = 0;
            _.forEach(vm.filteredOrganizations, function(organizationItem){
                organizationItem.highlightIndex = index++;
                _.forEach(organizationItem.spaces, function(spaceItem){
                    spaceItem.highlightIndex = index++;
                });
            });

            maxIndex = index;

        }


        // takes care of highlighting the matched search text with results
        // $sce service marks results as safe and can then be used by ng-bind-html directive
        function highlight(text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }
            return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
        }


        // bind
        $document.bind("keyup", function(event) {

            if(!vm.searchEnabled){
                console.log("asdfas");
                return;
            }

            $timeout(function(){
                if(event.keyCode == 40){
                    vm.highlightIndex = vm.highlightIndex + 1 <= maxIndex ? vm.highlightIndex + 1 : 0;
                }
                else if(event.keyCode == 38){
                    vm.highlightIndex = vm.highlightIndex - 1 >= 0 ? vm.highlightIndex - 1 : maxIndex;
                }
                else if(event.keyCode == 13){

                    var highlightedOrganization = _.find(vm.filteredOrganizations, { highlightIndex: vm.highlightIndex });
                    if(highlightedOrganization){
                        console.log(highlightedOrganization);
                    }
                    else{
                        var allFilteredSpaces = _.chain(vm.filteredOrganizations).pluck('spaces').flatten().value();
                        var highlightedSpace = _.find(allFilteredSpaces, { highlightIndex: vm.highlightIndex });

                        if(highlightedSpace){
                            $state.go('space.overview', { spaceId: highlightedSpace.id }, {reload: true});
                        }

                    }

                }

            });

        });



	}

})();