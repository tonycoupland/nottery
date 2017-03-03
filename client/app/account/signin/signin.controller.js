'use strict';

class SigninController {
  constructor(Auth, $state) {
    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
          email: this.user.email,
          password: this.user.password
        })
        .then(() => {
          // Logged in, redirect to account
          this.$state.go('account');
        })
        .catch(err => {
          this.errors.other = err.message;
        });
    }
  }
}

angular.module('notteryApp')
  .controller('SigninController', SigninController);
