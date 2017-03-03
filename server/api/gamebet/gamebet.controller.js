/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/gamebets              ->  index
 * POST    /api/gamebets              ->  create
 * GET     /api/gamebets/:id          ->  show
 * PUT     /api/gamebets/:id          ->  update
 * DELETE  /api/gamebets/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Gamebet from './gamebet.model';
import User from '../user/user.model';
import Transaction from '../transaction/transaction.model';
import Game from '../game/game.model';
import * as auth from '../../auth/auth.service';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Gamebets for this user, or if admin, for all users
export function index(req, res) {

  // Get usersID for authenticated session
  var userId = req.user._id;

  // If query string includes a game ID then filter by that
  var gameId = req.query.gameId;
  if ( gameId === undefined)
  {
    return Gamebet.find({"usersId":userId}).sort('-timestamp').exec()
      .then(gamebets => {
          res.status(200).json(gamebets);
        })
      .catch(handleError(res));
  }
  else
  {
    // There is a specific gameId
    if ( req.user.role === 'admin' ){
      return Gamebet.find({"gameId":gameId}).sort('-timestamp').populate('usersId','_id name').exec()
        .then(gamebets => {
            res.status(200).json(gamebets);
          })
        .catch(handleError(res));
    }
    else {
      return Gamebet.find({"usersId":userId, "gameId":gameId}).sort('-timestamp').exec()
        .then(gamebets => {
            res.status(200).json(gamebets);
          })
        .catch(handleError(res));
    }
  }


}


/**
 * Creates a new gamebet for the authenticated user
 */
export function create(req, res, next) {

  // Get usersID for authenticated session
  var userId = req.user._id;
  return User.findById(userId).exec()
    .then(user => {
      // Parse body
      var newGameBet = new Gamebet(req.body);
      newGameBet.timestamp = Date.now();
      newGameBet.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      // Validate bet
      if ( user.walletBalance < newGameBet.stake ){
        return res.status(402).json({message:"Insufficent money in wallet, reduce bet or deposit funds."});
      }
      if ( newGameBet.stake < 1 ){
        return res.status(402).json({message:"Minimum bet size is £1."});
      }
      if ( newGameBet.stake > 100 ){
        return res.status(402).json({message:"Maximum bet size is £100."});
      }


      // Create transaction for game bet
      return Game.findById(newGameBet.gameId).exec()
        .then(game => {
          // Get game title
          var description = '£' + newGameBet.stake + ' ' + (newGameBet.yayBet?'yay':'nay') + ' bet on ' + game.title ;

          // Create transaction
          return Transaction.create({
              usersId: userId,
              timestamp: Date.now(),
              amount: newGameBet.stake,
              balance: user.walletBalance - newGameBet.stake,
              transactionType: 'gamebet',
              description: description // eg 'Yay bet on UK Lotto Draw - Saturday 11th June 2016 7pm'
            }).then(()=>{

              // Update the user wallet balance and save the user
              user.walletBalance -= newGameBet.stake;
              return user.save()
                .then(() => {

                  // Now create and write the gamebet
                  newGameBet.usersId = userId;
                  newGameBet.save()
                    .then(function(gamebet) {

                      // Update the game object bet counts
                      if ( newGameBet.yayBet ){
                        game.yayBets+=newGameBet.stake;
                      }
                      else{
                        game.nayBets+=newGameBet.stake;
                      }

                      // Recalculate bet returns
                      game.recalculateBetReturns();

                      return game.save()
                        .then(() => {
                          // All good, return the game object
                          res.status(200).json(gamebet);
                        });
                    });
                  });
                })
                .catch(err => next(err));
              })
              .catch(err => next(err));

            });
}
