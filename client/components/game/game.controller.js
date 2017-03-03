'use strict';

class GameController {
  //end-non-standard

  //start-non-standard
  constructor(Auth, GameBet, $state, $scope, ngDialog) {
    this.Auth = Auth;
    this.GameBet = GameBet;

    this.$state = $state;
    this.$scope = $scope;

    this.isLoggedIn = Auth.isLoggedIn;
    this.dialog = ngDialog;
  }



  placeBet(side){
    if ( !this.isLoggedIn() ){
        // Not logged in, goto sign up
        this.dialog.open(
          {
            template: 'components/game/popupAuth.html',
            className: 'ngdialog-theme-default'
          });
    }
    else{
      // Show popup confirmation ticket
      this.$scope.ticketDetails = {
        game: this.game,
        stake: 10,
        side: side
      };

      var d = this.dialog.open(
        {
          template: 'components/game/popupConfirm.html',
          className: 'ngdialog-theme-default' ,
          scope: this.$scope
        });

      var _this = this;

      d.closePromise.then(function(data) {
        if (data.value && data.value === 'confirm') {

            // Post to create gamebet
            _this.GameBet.post({
              gameId: _this.game._id,
              stake: _this.$scope.ticketDetails.stake,
              yayBet: (_this.$scope.ticketDetails.side === 'yay')
            }).$promise.then(function() {
                // Account debitted, reload account and redirect to account transactions
                _this.Auth.reloadCurrentUser();
                _this.$state.go('account');
            }, function(error) {
              switch ( error.status )
              {
                case 401: // Unauthorised
                  _this.$state.go('signin');
                  break;

                case 402: // Error thrown
                  _this.dialog.open(
                    {
                      template: 'components/game/popupError.html',
                      className: 'ngdialog-theme-default' ,
                      data: error.data
                    });
                  break;

                default:
                  // error handler
                  alert(error.status + angular.fromJson(error));
                  break;
              }
            });
        }
        return true;
      });
    }
  };

}


angular.module('notteryApp').component('game', {
  templateUrl: 'components/game/game.html',
  controller: GameController,
  controllerAs: 'vm',
  bindings: {
    game: '='
  }
});
