'use strict';

angular.module('notteryApp.account')
  .config(function($stateProvider) {
    $stateProvider.state('account', {
      url: '/account',
      templateUrl: 'app/account/account.html',
      controller: 'AccountController',
      controllerAs: 'account',
      authenticate: 'user'
    });
  });
