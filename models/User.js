const mongoose = require('mongoose');

const Member = mongoose.Schema({
    id: String,
    totalvotes: Number,
    votedAt: Number,
    removeAt: Number
});

module.exports = mongoose.model(`VoteUser`, Member)