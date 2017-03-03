/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Transaction from '../api/transaction/transaction.model';
import Game from '../api/game/game.model';
import GameBet from '../api/gamebet/gamebet.model';

// Get Test User ID
var userId = '';
var gameId = '';

User.find({"role":"user"}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test',
      walletBalance:60
    })
    // , {
    //   provider: 'local',
    //   role: 'admin',
    //   name: 'Admin',
    //   email: 'admin@example.com',
    //   password: 'admin'
    // })
    .then(() => {
      console.log('finished populating users');
    })
    .then(()=> {User.findOne({ 'role':'user' }).exec()
      .then(user => {
        userId = user._id;

        // Now add some transactions for this user
        Transaction.find({}).remove()
          .then(() => {
            Transaction.create({
              usersId: userId,
              timestamp: '01-Jun-2016 13:30:00',
              amount: 70,
              balance: 70,
              transactionType: 'bonus',
              description: 'Bonus funds'
            },{
              usersId: userId,
              timestamp: '07-Jun-2016 22:32:15',
              amount: 10,
              balance: 60,
              transactionType: 'bet',
              description: 'Yay bet on UK Lotto Draw - Saturday 11th June 2016 7pm'
            })
            .then(() => {
              console.log('finished populating user transactions');
            });
          })
          // Now add some games
          .then(() => {
            Game.find({}).remove()
              .then(() => {
              Game.create({
                timestamp:'11-Jun-2016 19:30:00',
                title:'UK Lotto Draw - Saturday 11th June 2016',
                state:'complete',
                yayBets:10,
                nayBets:100,
                nayReturn:10,
                yayReturn:1.09,
                result:'yay'
              },{
                timestamp:'18-Jun-2016 19:30:00',
                title:'UK Lotto Draw - Saturday 18th June 2016',
                state:'complete',
                yayBets:25,
                nayBets:34,
                nayReturn:1.559,
                yayReturn:2.12,
                result:'nay'
              },{
                timestamp:'25-Jun-2016 19:30:00',
                title:'UK Lotto Draw - Saturday 25th June 2016',
                state:'active',
                yayBets:6,
                nayBets:35,
                nayReturn:1.029,
                yayReturn:6
              },{
                timestamp:'02-Jul-2016 19:30:00',
                title:'UK Lotto Draw - Saturday 2nd July 2016',
                state:'future',
                yayBets:0,
                nayBets:0,
                nayReturn:1,
                yayReturn:1
              },{
                timestamp:'09-Jul-2016 19:30:00',
                title:'UK Lotto Draw - Saturday 9th July 2016',
                state:'future',
                yayBets:0,
                nayBets:0,
                nayReturn:1,
                yayReturn:1
              },{
                timestamp:'16-Jul-2016 19:30:00',
                title:'UK Lotto Draw - Saturday 16th July 2016',
                state:'future',
                yayBets:0,
                nayBets:0,
                nayReturn:1,
                yayReturn:1
              },{
                timestamp:'23-Jul-2016 19:30:00',
                title:'UK Lotto Draw - Saturday 23rd July 2016',
                state:'future',
                yayBets:0,
                nayBets:0,
                nayReturn:1,
                yayReturn:1
              })
              .then(() => {
                console.log('finished populating games');
              })
              .then(()=> {Game.findOne({state:'active'}).exec()
                .then(game => {
                  gameId = game._id;

                  // Add a game bet
                  GameBet.find({}).remove()
                  .then(() => {
                    GameBet.create({
                      usersId: userId,
                      gameId: gameId,
                      timestamp:'07-Jun-2016 22:32:15',
                      ipAddress:'127.0.0.1',
                      stake:4,
                      yayBet:true
                    },{
                      usersId: userId,
                      gameId: gameId,
                      timestamp:'07-Jun-2016 23:32:15',
                      ipAddress:'127.0.0.1',
                      stake:2,
                      yayBet:true
                    },{
                      usersId: userId,
                      gameId: gameId,
                      timestamp:'09-Jun-2016 08:32:15',
                      ipAddress:'127.0.0.1',
                      stake:10,
                      yayBet:false
                    },{
                      usersId: userId,
                      gameId: gameId,
                      timestamp:'10-Jun-2016 09:32:15',
                      ipAddress:'127.0.0.1',
                      stake:20,
                      yayBet:false
                    },{
                      usersId: userId,
                      gameId: gameId,
                      timestamp:'15-Jun-2016 22:32:15',
                      ipAddress:'127.0.0.1',
                      stake:5,
                      yayBet:false
                    })
                  })
                });
              });
            });
          });
        });
      });
  });
