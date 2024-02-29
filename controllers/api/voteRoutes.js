const router = require("express").Router();
const Vote = require("../../models/Vote");
const { User, Bet } = require("../../models");

//Create a vote
router.post("/:bet_id", async (req, res) => {
  try {
    const newVote = await Vote.create({
      ...req.body,
      bet_id: req.params.bet_id,
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

// Get all votes for a bet
router.get("/:bet_id", async (req, res) => {
  try {
    const allVotes = await Vote.findAll({
      where: {
        bet_id: req.params.bet_id,
      },

      include: [{ model: User }, { model: Bet }],
    });

    if (!allVotes) {
      res.json({ message: "No bet found with that id" });
    }

    // For displaying on page

    // const votes = allVotes.map(vote => vote.get({ plain: true }));

    // res.render('', {
    //     ...votes,
    //     logged_in: req.session.logged_in
    // });
  } catch (err) {
    res.json({ message: "Error with getting all votes", err });
  }
});
