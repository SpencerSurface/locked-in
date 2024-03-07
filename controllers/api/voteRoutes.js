const router = require("express").Router();
const Vote = require("../../models/Vote");
const { User, Bet } = require("../../models");

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

// check votes for a bet for a winner
router.get("/check/:id", async (req, res) => {
  try {
    const allVotes = await Vote.findAll({
      where: {
        bet_id: req.params.id,
      },
      include: [{ model: User }, { model: Bet }],
    });

    if (!allVotes || allVotes.length === 0) {
      return res.json({ message: "No votes found with that id" });
    }

    // Array of votes as plain objects so far only works with both votes
    const votes = allVotes.map((vote) => vote.get({ plain: true }));

    const voteCounts = [];

    votes.forEach((vote) => {
      const option = vote.vote;
      voteCounts.push(option);
    })

    if(voteCounts[0] === voteCounts[1]){
      const betId = req.params.id; 
      const winner = voteCounts[0];
      const status = "SETTLED";
      const updateBet = await fetch(`/api/bets/${betId}`, {
        method: "PUT",
        body: JSON.stringify({ winner, status }),
        headers: { "Content-Type": "application/json" },
      });

      if(updateBet.ok){
        return res.json(updateBet);
      }
    }else {
      return;
    }

    res.json(votes);
  } catch (err) {
    res.json({ message: "Error with getting all votes", err });
  }
});

module.exports = router;