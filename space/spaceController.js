(function(){
	'use strict';

	angular
		.module('space-controllers', [])
		.controller('spaceController', SpaceController);

    SpaceController.$inject = ['spaceResource'];

	function SpaceController(spaceResource){
		var vm = this;


		(function(){

            console.log("asdfa");

            spaceResource.space().get(function(data){

                console.log(data);

            });


		})();



	}

})();