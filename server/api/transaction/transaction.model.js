'use strict';

import mongoose from 'mongoose';

const transactionTypes = ['deposit', 'withdrawl', 'gamebet', 'gameresult', 'bonus'];

var TransactionSchema = new mongoose.Schema({
  usersId: String,
  timestamp: Date,
  amount: Number,
  balance: Number,
  transactionType: String,
  description: String
});

export default mongoose.model('Transaction', TransactionSchema);
