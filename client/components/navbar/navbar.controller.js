'use strict';

class NavbarController {
  //end-non-standard

  //start-non-standard
  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;

    this.menu = [{ 'title': 'Home', 'state': 'main' },
                { 'title': 'Games', 'state': 'games/list' },
                  { 'title': 'About', 'state': 'about' }];
  }

}

angular.module('notteryApp')
  .controller('NavbarController', NavbarController);
