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
        vm.searchEnabled = false;
        vm.filteredOrganizations = [];
        vm.highlightIndex = 0;

        // declare functions here
        vm.filter = filter;
        vm.highlight = highlight;
        vm.reset = reset;

		(function(){

            // get all the organizations and spaces
            spaceResource.space().get(function(data){
                organizations = data;
                vm.filteredOrganizations = organizations;

                indexifyResults();

                console.log(data);
            });

        })();


        // resets variables when search view is closed
        function reset(){
            vm.searchEnabled = false;
            vm.searchText = "";
            vm.filteredOrganizations = organizations;

            indexifyResults();
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
                        var tempOrg = _.cloneDeep(organizationItem);
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

        }

        // give each recode an index
        // this index will be tracked for highlighting and navigating to that item
        function indexifyResults(){
            vm.highlightIndex = 0;

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


        // bind key press events
        // event handler for up, down and enter keys
        $document.bind("keyup", function(event) {

            $timeout(function(){
                if(vm.searchEnabled && event.keyCode == 40){
                    vm.highlightIndex = vm.highlightIndex + 1 <= maxIndex ? vm.highlightIndex + 1 : 0;
                }
                else if(vm.searchEnabled && event.keyCode == 38){
                    vm.highlightIndex = vm.highlightIndex - 1 >= 0 ? vm.highlightIndex - 1 : maxIndex;
                }
                else if(vm.searchEnabled && event.keyCode == 13){

                    var highlightedOrganization = _.find(vm.filteredOrganizations, { highlightIndex: vm.highlightIndex });
                    if(highlightedOrganization){
                        reset();
                        $state.go('space.organizationOverview', { organizationId: highlightedOrganization.id });
                    }
                    else{
                        var allFilteredSpaces = _.chain(vm.filteredOrganizations).pluck('spaces').flatten().value();
                        var highlightedSpace = _.find(allFilteredSpaces, { highlightIndex: vm.highlightIndex });

                        if(highlightedSpace){
                            reset();
                            $state.go('space.spaceOverview', { spaceId: highlightedSpace.id });
                        }

                    }
                }
            });

        });


	}

})();