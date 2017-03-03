'use strict';

(function() {

  function GameResource($resource) {
    return $resource('/api/games/:id/:controller',
        {
          id: '@_id'
        }, // Defaults

        {
          get: {
            method: 'GET',
            params: {
              id: 'me'
            }
          },
          active: {
            method: 'GET',
            params: {
              id: 'active'
            }
          },
          put: {
            method: 'PUT'
          }
      } // Actions
    );
  }

  angular.module('notteryApp')
    .factory('Game', GameResource);
})();
