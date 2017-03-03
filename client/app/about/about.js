'use strict';

angular.module('notteryApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('about', {
        url: '/about',
        template: '<about></about>'
      });
  });
