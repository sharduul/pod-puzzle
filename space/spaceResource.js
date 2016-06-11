(function() {
	'use strict';

	angular
		.module('space-services', [])
		.factory('spaceResource', SpaceResource);

    SpaceResource.$inject = ['$resource'];

	function SpaceResource($resource){
		return{
			space: space
		};

		function space(){
			return $resource('assets/spaces.json', { }, {
				get: { method: 'GET', isArray: true },

                // kept here to show that in real world application this will call the RESTful API
                update: { method: 'PUT' },
				save: { method: 'POST' },
				remove: { method: 'DELETE' }
			});
		}

	}
})();