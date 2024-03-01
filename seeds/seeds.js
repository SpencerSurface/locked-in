const sequelize = require("../config/connection");
const {User, Bet, Stake, Vote} = require("../models");

const userData = require("./userData.json");
const betData = require("./betData.json");
const stakeData = require("./stakeData.json");
const voteData = require("./voteData.json");

const seedDatabase = async () => {
    await sequelize.sync({force: true});
    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    const bets = await Bet.bulkCreate(betData, {
        individualHooks: true,
        returning: true,
    });

    const stakes = await Stake.bulkCreate(stakeData, {
        individualHooks: true,
        returning: true,
    });

    const votes = await Vote.bulkCreate(voteData, {
        individualHooks: true,
        returning: true,
    });

    process.exit(0);
}

seedDatabase();