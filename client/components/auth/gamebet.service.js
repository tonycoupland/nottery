'use strict';

(function() {

  function GameBetResource($resource) {
    return $resource('/api/gamebets/:id/:controller', {
      id: '@_id'
    }, {
      post: {
        method: 'POST'
      }
    });
  }

  angular.module('notteryApp')
    .factory('GameBet', GameBetResource);
})();
