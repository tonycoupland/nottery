'use strict';

angular.module('notteryApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('games', {
        abstract: true,
        url: '/games',
        template: '<div ui-view></div>'
        //templateUrl: 'app/games/games.html'
      })
      .state('games.list', {
        url: '/list',
        templateUrl: 'app/games/gameslist.html',
        controller: 'GamesController'
      })
      .state('games.detail', {
        url: '/:id',
        templateUrl: 'app/games/gamesdetail.html',
        controller: 'GamesController'
      });
  });
