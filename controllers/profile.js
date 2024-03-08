const router = require("express").Router();
const { User, Bet, Stake, Vote } = require("../models");
const { Op } = require("sequelize");

// Gets all of the users pending and active bets
router.get("/", async (req, res) => {
  try {
    if (!req.session.user_id) {
      return res.redirect("/login");
    }

    // Get all of the user info
    const userData = await User.findByPk(req.session.user_id);
    const user = userData.get({ plain: true });

    // Find all of the users stakes
    const userStakes = await Stake.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });

    // Gets all bet ids from current users Stakes
    const betIds = userStakes.map((stake) => stake.get({ plain: true }).bet_id);

    // Retrieving all Stakes for the same bets, Excluding the current users stakes
    const otherStakes = await Stake.findAll({
      where: {
        bet_id: {
          [Op.in]: betIds,
        },

        user_id: {
          [Op.ne]: req.session.user_id,
        },
      },
      include: [{ model: User }, { model: Bet }],
    });

    //Filters the bets based on if there pending
    const pendingBet = otherStakes
      .filter((stake) => stake.bet.status === "PENDING")
      .map((stake) => stake.get({ plain: true }));

    //filter the bets based on if there in progress
    const activeBet = otherStakes
      .filter((stake) => stake.bet.status === "IN_PROGRESS")
      .map((stake) => stake.get({ plain: true }));

    res.render("profile", { user, pendingBet, activeBet });
  } catch (error) {
    res.status(500).json(error);
  }
});

// For settled bets
router.get("/settled", async (req, res) => {
  try {

    if (!req.session.user_id) {
        return res.redirect("/login");
    }
    //Get user data
    const userData = await User.findByPk(req.session.user_id);
    const user = userData.get({ plain: true });

    const userStakes = await Stake.findAll({
        where: {
          user_id: req.session.user_id,
        },
    });

    // Gets all bet ids from current users Stakes
    const betIds = userStakes.map((stake) => stake.get({ plain: true }).bet_id);

    // Retrieving all Stakes for the same bets, Excluding the current users stakes
    const otherStakes = await Stake.findAll({
      where: {
        bet_id: {
          [Op.in]: betIds,
        },

        user_id: {
          [Op.ne]: req.session.user_id,
        },
      },
      include: [{ model: User }, { model: Bet}],
    });

    const settledBets = otherStakes
      .filter((stake) => stake.bet.status === "SETTLED")
      .map((stake) => stake.get({ plain: true }));

    

    
    // Get winner id and find User by id
    // const winnerData = settledBets.map(async (winner) => {
    //   const winnerIds = winner.bet.winner;

    //   const winners = await User.findByPk(winnerIds);
    //   return winners.get({ plain: true });
    // });

    // const winners = await Promise.all(winnerData);

    res.render("profile-settled", { user, settledBets});
  } catch (err) {
    res.json(err);
  }
});

// For new bet page
router.get('/new-bet', async (req, res) => {
    try{
        if (!req.session.user_id) {
            return res.redirect("/login");
        };

        res.render("new-bet");
    }catch(err){
        res.json(err);
    }
})

// For creating a new bet
router.post('/new-bet', async (req, res) => {
    try{
        //Make the new bet
        const newBet = await Bet.create({
            title: req.body.title,
            amount: req.body.betAmount,
            created_by: req.session.user_id,
            status: "PENDING",
        });

        const newBetId = newBet.id;

        // Make a stake for the user
        const userStake = await Stake.create({
            amount: req.body.stake,
            user_id: req.session.user_id,
            bet_id: newBetId,
        });

        //Make a stake for the other user

        // First find the user
        const otherUserData = await User.findAll({
            where: {username: req.body.sendTo}
        });

        if(!otherUserData){
            res.json({ message: "Cannot find that user"});
        };

        // Get other users id
        const otherUser = otherUserData.map((user) => user.get({ plain: true }).id);

        //Create stake for the other user
        const otherUserStake = await Stake.create({
            amount: req.body.stake,
            user_id: otherUser,
            bet_id: newBetId,
        });

        res.json({ newBet, userStake, otherUserStake});
    }catch(err){
        res.json({message: "Error with creating Bet", err});
    }
});

router.get('/summary', async (req, res) => {
  try{

    //Get all of the users Stakes
    const allUserStakes = await Stake.findAll({
      where: {user_id: req.session.user_id},
      include: [
        {model: Bet},
        {model: User}
      ]
    });

    const userStakes = allUserStakes.map((stake) => stake.get({ plain: true }));

    res.render("summary", { userStakes });

  }catch(err){
    res.json({ message: "Error getting summary data", err});
  }
})

module.exports = router;
