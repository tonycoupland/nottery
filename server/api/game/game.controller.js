/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/games              ->  index
 * POST    /api/games              ->  create
 * GET     /api/games/:id          ->  show
 * PUT     /api/games/:id          ->  update
 * DELETE  /api/games/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Game from './game.model';
import Gamebet from '../gamebet/gamebet.model';
import User from '../user/user.model';
import Transaction from '../transaction/transaction.model';
import compose from 'composable-middleware';
import * as auth from '../../auth/auth.service';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function saveGameResultUpdate(res,result) {
  return function(entity) {
    // Update game result
    var updated = _.merge(entity,
      {
        state:'complete',
        result:result
      });
    return updated.save()
      .then(updated => {

        // Payout to all winning bets
        console.log('Paying out...');
        return Gamebet.find({"gameId":entity._id}).exec()
          .then(gamebets => {
              if ( gamebets.length > 0){
                return payoutGameBets(updated, gamebets, (result==='yay'));
              }
              return updated;
            })
          .catch(handleError(res));

      });
  };
}

function payoutGameBets(game, gamebets, payoutYayBets){

  // Take the head of the gamebets and pay it... if its a winner
  var gamebet = gamebets.pop();

  // Was this gamebet correct?
  if ( gamebet.yayBet === payoutYayBets){
    return payoutGameBet(game, gamebet)
      .then(() => {
        // Payout the remaining bets
        if ( gamebets.length > 0){
          return payoutGameBets(game, gamebets, payoutYayBets);
        }
        // No more bets to process
        return game;
      });
  }
  else{
    // Payout the remaining bets
    if ( gamebets.length > 0){
      return payoutGameBets(game, gamebets, payoutYayBets);
    }
  }
  // No more bets to process
  return game;
}

function payoutGameBet(game, gamebet){

  return User.findById(gamebet.usersId).exec()
    .then(user => {

      // Create transaction for payout
      var payout = (game.result === 'yay' ? game.yayReturn : game.nayReturn) * gamebet.stake;
      var newWalletBalance = user.walletBalance + payout;

      console.log('Paying out £' + payout + ' to ' + user.name);

      // Post transaction
      return Transaction.create({
        usersId: gamebet.usersId,
        timestamp: Date.now(),
        amount: payout,
        balance: newWalletBalance,
        transactionType: 'gameresult',
        description: 'Payout from ' + game.result + ' bet on ' + game.title
      }).then(()=>{
        user.walletBalance = newWalletBalance;
        return user.save();
      });
    });

}


function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Games
export function index(req, res) {
  return Game.find({},'-yayBets -nayBets').sort('-timestamp').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Game from the DB
export function show(req, res) {
  return Game.findById(req.params.id,'-yayBets -nayBets').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Game in the DB
export function update(req, res) {
  console.log('Updating game ' + req.params.id + ' to ' + req.body.result);
  if (req.body._id) {
    delete req.body._id;
  }
  return Game.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveGameResultUpdate(res, req.body.result))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Game from the DB
export function destroy(req, res) {
  return Game.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * Return all active games
 */
export function active(req, res) {

  return Game.find({ state: 'active' },'-yayBets -nayBets').sort('timestamp').exec()
    .then(games => {res.status(200).json(games);})
    .catch(handleError(res));
}


/**
 * Check all active games aren't ready to be 'locked' and any future games
 * aren't ready to be active
 */
export function checkgamestates() {
  return compose()

    // Check games
    .use(function(req, res, next) {
      // If checked recently, carry on
      if ( req.app.lastcheckedgames === undefined ){
        req.app.lastcheckedgames = new Date();
      }
      else {
        if ( (new Date() - req.app.lastcheckedgames) < 5000 ) // We've checked less than 5s ago
        {
          return next();
        }
      }

      console.log('Checking game states...' );

      // Find top 1 active game with a timestamp <= now and make is locked
      return Game.find({ state: 'active', 'timestamp': {'$lte' : new Date() } }).limit(1).exec()
        .then(games => {
          if ( games.length > 0 ){
            console.log('Found game ('+games[0].title+') which has ended, setting to "locked"' );
            games[0].state = 'locked';
            games[0].save()
              .then(() => {

                // We've updated an active game to be locked... we should ensure we have
                // one active game
                return ensureOneActiveGame().then(() => { return next();});
              })
              .catch(err => next(err));
            }
            else{
              // No games to expire, so we should check if we should create one
              return ensureOneActiveGame().then(() => { return next();});
            }
        });
      });
}

function ensureOneActiveGame(){
  return Game.find({ state: 'active' }).limit(1).exec()
    .then(games => {
      if ( games.length === 0 ){

        // Get date for next Draw
        var dateForNextDraw = getNextSaturday();
        var gameTitle = 'UK Lotto Draw - Saturday ' + ordinal_suffix_of(dateForNextDraw.getDate()) + ' ' +
        ['','Jan','Feb','Mar','Apr','Jun','Jul','Aug','Sept','Oct','Nov','Dec'][dateForNextDraw.getMonth()] + ' ' +
        dateForNextDraw.getFullYear();

        console.log('Found no active games so creating an active game for ' + gameTitle );

        return Game.create({
          timestamp: dateForNextDraw,
          title:gameTitle,
          state:'active',
          yayBets:0,
          nayBets:0,
          nayReturn:1,
          yayReturn:1
        });
      }
    });
}
function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}
function getNextSaturday()
{
	var d = new Date();
  // Move forward one day so we don't create the game 'today'
  d.setDate(d.getDate() + 1);
  // Reset date to have no time part
  d = new Date(d.getFullYear(), d.getMonth(), d.getDate(),0,0,0,0);
  // Move time back to beginning of week then forward 6 days 19.5 hours
  d.setTime(d.getTime()-(d.getDay()*24*60*60*1000)+(((6*24)+19.5)*60*60*1000));
	return d;
}
