'use strict';
(function(){

class AddFundsController {
  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
  }

  resetDemoAccountBalance(form){
    this.Auth.resetDemoAccountBalance()
      .then((user) => {
        // Account creditted, redirect to account
        this.$state.go('account');
      });
  };
}

angular.module('notteryApp')
  .controller('AddFundsController', AddFundsController);

})();
