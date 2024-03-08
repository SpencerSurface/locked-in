const router = require("express").Router();
const { Sequelize } = require("sequelize");
// const Vote = require("../../models/Vote");
const { User, Bet, Vote } = require("../../models");

//Create a vote
router.post("/", async (req, res) => {
  try {
    const newVote = await Vote.create({
      vote: req.body.votedUser,
      bet_id: req.body.betId,
      user_id: req.session.user_id,
    });

    res.json(newVote);
  } catch (err) {
    res.json({ message: "Error with creating vote", err });
  }
});

// Get a single vote
router.get("/:id", async (req, res) => {
  try {
    const voteData = await Vote.findByPk(req.params.id, {
      include: [{ model: User }, { model: Bet }],
    });

    if (!voteData) {
      res.json({ message: "No vote with this id" });
      return;
    }
  } catch (err) {
    res.json({ message: "Error with getting vote", err });
  }
});

//Update Winners net amount
const updateUserWinner = async (betWinner, betAmount) => {
  return await User.update(
    {net_winning: Sequelize.literal(`net_winning + ${betAmount}`)},
    {where: { id: betWinner }}
  );
};

// Update losers net amount
const updateUserLoser = async (betLoser, betAmount) => {
  return await User.update(
    {net_winning: Sequelize.literal(`net_winning - ${betAmount}`)},
    {where: { id: betLoser }}
  );
};

//For updating bets to settled and updating winner
const updateBetWinner = async (betId, winner, winnerName) => {
  const status = "SETTLED";
  return await Bet.update(
    { status: status, winner: winner, winner_username: winnerName },
    { where: { id: betId } }
  );
};

// For updating bets to voided
const updateBetVoid = async (betId) => {
  const status = "VOID";
  const forWinner = "VOIDED"
  return await Bet.update(
    {status: status, winner_username: forWinner},
    {where: { id: betId }}
  )
}

// check votes of a bet
router.get("/check/:id", async (req, res) => {
  try {
    const allVotes = await Vote.findAll({
      where: {
        bet_id: req.params.id,
      },
      include: [{ model: User }, { model: Bet }],
    });

    if (!allVotes) {
      return res.json({ message: "No votes found with that id" });
    } else if (allVotes.length === 1) {
      // If there is only one vote, send additional information to the client
      const vote = allVotes[0]; // Assuming there's only one vote
      const voteData = vote.get({ plain: true });

      //If only the current user voted
      if (voteData.user_id === req.session.user_id) {
        return res.json({ userVoted: voteData });
      } else {
        return res.json({ otherUserVoted: voteData });
      }
    } else if (allVotes.length === 0) {
      return;
    }

    // Array of votes as plain objects so far only works with both votes
    const votes = allVotes.map((vote) => vote.get({ plain: true }));

    const voteCounts = [];

    votes.forEach((vote) => {
      const option = vote.vote;
      voteCounts.push(option);
    });

    //Checks if both of the votes are for the same user
    if (voteCounts[0] === voteCounts[1]) {
      const betId = req.params.id;

      //ids of both of the voters
      const [user1, user2] = votes.map((vote) => vote.user_id);

      //user id of the winner
      const betWinner = voteCounts[0];

      // user id of the loser
      const betLoser = betWinner === user1 ? user2 : user1;

      const winnerData = await User.findByPk(betWinner);
      // Username of winner
      const winnerName = winnerData.get({ plain: true }).username;
      // const winnerId = winnerData.get({ plain: true }).id;

      // Getting bet amount
      const betData = await Bet.findByPk(betId);
      const betAmount = betData.get({ plain: true }).amount;
      
      await updateUserLoser(betLoser, betAmount);
      await updateUserWinner(betWinner, betAmount);
      await updateBetWinner(betId, betWinner, winnerName);
      return res.json({ bothUsersVoted: winnerData});

      //If users chose opposite answers
    } else {
      const betId = req.params.id;

      await updateBetVoid(betId);
      return res.json({ message: "Bet Voided due to opposite votes"})
    }

    // res.json(votes);
  } catch (err) {
    res.json({ message: "Error with getting all votes", err });
  }
});

module.exports = router;
