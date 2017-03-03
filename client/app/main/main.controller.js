'use strict';

(function() {

  class MainController {

    constructor($http) {
      this.$http = $http;
      this.games = [];
    }

    $onInit() {
      this.$http.get('/api/games/active')
        .then(response => {
          this.games = response.data;
        });
    }
  }

  angular.module('notteryApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController,
      controllerAs: 'main',
    });
})();
