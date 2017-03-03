'use strict';

angular.module('notteryApp', ['notteryApp.auth', 'notteryApp.account', 'notteryApp.admin', 'notteryApp.constants',
    'ngCookies', 'ngResource', 'ngSanitize', 'ngDialog',
    'ui.router', 'validation.match'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
