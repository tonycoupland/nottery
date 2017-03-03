'use strict';

(function(){

angular.module('notteryApp')
  .controller('GamesController', ['$scope', '$http', '$state', '$location', 'Auth', 'Game', function($scope, $http, $state, $location, Auth, Game) {

    // Record user status
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.games = [];
    $scope.yaygamebets = [];
    $scope.naygamebets = [];
    $scope.yaygamebetstotal = 0;
    $scope.naygamebetstotal = 0;
    $scope.yaygamebetstotalreturn = 0;
    $scope.naygamebetstotalreturn = 0;


    if ( $state.params.id !== undefined )
    {
      // One game
      loadSingleGame();
    }
    else {
      // All games
      $http.get('/api/games').success(function(data){
        $scope.games = data;
      });
    }





    // Load single game
    function loadSingleGame(){
      $http.get('/api/games/' + $state.params.id).success(function(data){
        var game = data;
        $scope.games = [data];

        // Are we logged in?
        if (Auth.isLoggedIn()){
          // Do we have any game bets on this game?
          $http.get('/api/gamebets?gameId=' + $state.params.id).success(function(data){

            // Reset scope variables
            $scope.yaygamebets = [];
            $scope.naygamebets = [];
            $scope.yaygamebetstotal = 0;
            $scope.naygamebetstotal = 0;
            $scope.yaygamebetstotalreturn = 0;
            $scope.naygamebetstotalreturn = 0;

            // Create collections of yay and nay bets
            for (var i=0; i < data.length; i++){
              var gamebet = data[i];
              if ( gamebet.yayBet === true){
                $scope.yaygamebets.push(gamebet);
                $scope.yaygamebetstotal += gamebet.stake;

                // Update return
                if ( game.result === '' || game.result == 'yay'){
                  gamebet.return = (gamebet.stake * game.yayReturn);
                  $scope.yaygamebetstotalreturn += gamebet.return;
                }
                else{
                  gamebet.return = '-';
                }
              }
              else {
                $scope.naygamebets.push(gamebet);
                $scope.naygamebetstotal += gamebet.stake;

                // Update return
                if ( game.result === '' || game.result == 'nay'){
                  gamebet.return = (gamebet.stake * game.nayReturn);
                  $scope.naygamebetstotalreturn += gamebet.return;
                }
                else{
                  gamebet.return = '-';
                }
              }
            }
          });
        }
      });
    }



    // Add record result method
    $scope.recordResult = function(result){
      // Are we an admin?
      if ( Auth.isAdmin()){
        // Post to server to record result
        Game.put({
          _id: $scope.games[0]._id,
          result: result
        }).$promise.then(function() {
            // Result entered
            loadSingleGame();
        }, function(error) {
          switch ( error.status )
          {
            case 401: // Unauthorised
              _this.$state.go('signin');
              break;

            default:
              // error handler
              alert(error.status + angular.fromJson(error));
              break;
          }
        });
      }
    }


  }]);
})();
