'use strict';

angular.module('notteryApp.auth', ['notteryApp.constants', 'notteryApp.util', 'ngCookies',
    'ui.router'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
