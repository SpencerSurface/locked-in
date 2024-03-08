const router = require("express").Router();
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

    // For displaying on page

    // const vote = voteData.get({ plain: true });

    // res.render('', {
    //     ...vote,
    //     logged_in: req.session.logged_in
    // });
  } catch (err) {
    res.json({ message: "Error with getting vote", err });
  }
});


//For updating bets through router
const updateBetStatus = async (betId, winner) => {
  const status = "SETTLED";
  return await Bet.update({ status, winner }, { where: { id: betId } });
};

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

    }else if(allVotes.length === 1){
      // If there is only one vote, send additional information to the client
      const vote = allVotes[0]; // Assuming there's only one vote
      const voteData = vote.get({ plain: true });

      //If only the current user voted
      if(voteData.user_id === req.session.user_id){
        return res.json({ userVoted: voteData });

      }else {
        return res.json({ otherUserVoted: voteData });
      }
    }else if(allVotes.length === 0){
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
      const betWinner = voteCounts[0];

      const winnerData = await User.findByPk(betWinner);

      const winner = winnerData.get({ plain: true }).username;



      await updateBetStatus(betId, winner);
      return res.json({ message: "Bet updated successfully" });
    } else {
      return;
    }

    // res.json(votes);
  } catch (err) {
    res.json({ message: "Error with getting all votes", err });
  }
});

module.exports = router;
