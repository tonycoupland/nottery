'use strict';
(function(){

class AccountController {
  constructor(Transaction) {
    // Use the Transaction $resource to fetch all our transactions
    this.transactions = Transaction.query();
  }
}

angular.module('notteryApp.account')
  .controller('AccountController', AccountController);
  // .component('account', {
  //   templateUrl: 'app/account/account.html',
  //   controller: AccountComponent
  // });

})();
