(function(){
	'use strict';

	angular
		.module('space-controllers', [])
		.controller('spaceController', SpaceController);

    SpaceController.$inject = ['spaceResource'];

	function SpaceController(spaceResource){
		var vm = this;

        vm.organizations = [];


		(function(){

            spaceResource.space().get(function(data){
                vm.organizations = data;
                console.log(data);
            });

		})();



	}

})();