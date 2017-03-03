'use strict';

(function() {

  function TransactionResource($resource) {
    return $resource('/api/transactions/:id/:controller', {
      id: '@_id'
    }, {
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      }
    });
  }

  angular.module('notteryApp.auth')
    .factory('Transaction', TransactionResource);
})();
