'use strict';

import mongoose from 'mongoose';

var GamebetSchema = new mongoose.Schema({
    usersId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    gameId: String,
    timestamp: Date,
    ipAddress: String,
    stake: Number,
    yayBet: Boolean
});

export default mongoose.model('Gamebet', GamebetSchema);
