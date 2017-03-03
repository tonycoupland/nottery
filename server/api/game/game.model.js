'use strict';

import mongoose from 'mongoose';

const gameStates = ['future', 'active', 'locked', 'complete'];

var GameSchema = new mongoose.Schema({
  timestamp: Date,
  title: String,
  state: {type: String, default:'future'},
  yayBets: {type: Number, default:0},
  nayBets: {type: Number, default:0},
  yayReturn: {type: Number, default:1},
  nayReturn: {type: Number, default:1},
  result: {type: String, default:''}
});


/**
 * Methods
 */
GameSchema.methods = {
  /**
   * recalculateBetReturns
   */
  recalculateBetReturns() {

    // If this game is still active then use the amounts of each side
    // to calculate the returns
    var prizepot = Math.floor((this.nayBets + this.yayBets) * 0.9);

    // Calculate estimated return for each side
    this.nayReturn = ((prizepot) / (this.nayBets));
    this.yayReturn = ((prizepot) / (this.yayBets));

    // Exceptions
    if ( this.nayReturn == 0 && this.yayReturn == 0)
    {
        this.nayReturn = this.yayReturn = 1;
    }
    else if (this.nayBets == 0)
    {
        // There are no nay bets, so any bet would take the whole pot
        this.nayReturn = prizepot;
    }
    else if ( this.yayBets == 0)
    {
        this.yayReturn = prizepot;
    }

    // Min return to 1... this may result in a zero house win
    this.nayReturn = Math.max(1, this.nayReturn);
    this.yayReturn = Math.max(1, this.yayReturn);

  }
};

export default mongoose.model('Game', GameSchema);
