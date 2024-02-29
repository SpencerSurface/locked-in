const User = require("./User");
const Bet = require("./Bet");
const Stake = require("./Stake");
const Vote = require("./Vote");


// Relate User and Bet through Stake
User.hasMany(Stake, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});

Stake.belongsTo(User, {
    foreignKey: "user_id"
});

Bet.hasMany(Stake, {
    foreignKey: "bet_id",
    onDelete: "CASCADE"
});

Stake.belongsTo(Bet, {
    foreignKey: "bet_id"
});


// A User wins a Bet
User.hasMany(Bet, {
    foreignKey: "winner"
});

Bet.belongsTo(User, {
    foreignKey: "winner"
});


// Relate User and Bet through Vote
User.hasMany(Vote, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});

Vote.belongsTo(User, {
    foreignKey: "user_id"
});

Bet.hasMany(Vote, {
    foreignKey: "bet_id",
    onDelete: "CASCADE"
});

Vote.belongsTo(Bet, {
    foreignKey: "bet_id"
});


// A Vote is for a User
User.hasMany(Vote, {
    foreignKey: "vote"
});

Vote.belongsTo(User, {
    foreignKey: "vote"
});


module.exports = {User, Bet, Stake, Vote}