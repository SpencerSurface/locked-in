const sequelize = require("../config/connection");
const {User, Bet, Stake, Vote} = require("../models");

const userData = require("./userData.json");
const betData = require("./betData.json");

const seedDatabase = async () => {
    // Sync with the database
    await sequelize.sync({force: true});

    // Create users from file
    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true
    });

    // Create bets from file
    const bets = await Bet.bulkCreate(betData, {
        individualHooks: true,
        returning: true
    });

    // Create random stakes that agree with the users and bets (2 stakes per bet)
    const stakes = [];
    for (let i = 0; i < bets.length; i++) {
        let bet = bets[i];
        let userIdList = users.map((user) => user.dataValues.id);
        // Get a random number between 20% of the bet amount and 80% of the bet amount
        let portion = Math.floor(((Math.random() * 6 + 2) / 10) * bet.amount);
        // If there's a winner, create a stake for them
        if (bet.dataValues.winner) {
            stakes.push(await Stake.create({amount: portion, user_id: bet.dataValues.winner, bet_id: bet.dataValues.id}));
            userIdList.splice(userIdList.indexOf(bet.dataValues.winner), 1);
        // Else, create a first stake for a random user
        } else {
            let randomIndex = Math.floor(Math.random() * userIdList.length);
            let randomUser = userIdList.splice(randomIndex, 1)[0];
            stakes.push(await Stake.create({amount: portion, user_id: randomUser, bet_id: bet.dataValues.id}));
        }
        // Create the second stake for a random user
        let randomIndex = Math.floor(Math.random() * userIdList.length);
        let randomUser = userIdList.splice(randomIndex, 1)[0];
        stakes.push(await Stake.create({amount: (bet.amount - portion), user_id: randomUser, bet_id: bet.dataValues.id}));
    }

    // Create random votes that agree with the users, bets, and stakes
    const votes = [];
    for (let i = 0; i < stakes.length; i++) {
        const stake = stakes[i];
        // Get the bet that each stake belongs to
        const bet = bets.filter((bet) => bet.dataValues.id === stake.dataValues.bet_id)[0];
        const status = bet.dataValues.status;
        if (status === "SETTLED") {
            votes.push(await Vote.create({vote: bet.dataValues.winner, user_id: stake.dataValues.user_id, bet_id: stake.dataValues.bet_id}));
        }
    }

    process.exit(0);
}

seedDatabase();