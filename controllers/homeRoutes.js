const express = require("express");
const router = express.Router();
const { User, Bet, Stake, Vote } = require("../models");
const { findAll } = require("../models/User");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    const bets = await Bet.findAll();
    res.render("homepage", bets);
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.get("/profile", async (req, res) => {
//   try {
//     if (!req.session.user_id) {
//       return res.redirect("/login");
//     }

//     // Get all of the user info
//     const userData = await User.findByPk(req.session.user_id);
//     const user = userData.get({ plain: true });

//     // Find all of the users stakes
//     const userStakes = await Stake.findAll({
//       where: {
//         user_id: req.session.user_id,
//       },
//     });

//     // Gets all bet ids from current users Stakes
//     const betIds = userStakes.map((stake) => stake.get({ plain: true }).bet_id);

//     // Retrieving all Stakes for the same bets, Excluding the current users stakes
//     const otherStakes = await Stake.findAll({
//       where: {
//         bet_id: {
//           [Op.in]: betIds,
//         },

//         user_id: {
//           [Op.ne]: req.session.user_id,
//         },
//       },
//       include: [{ model: User }, { model: Bet }],
//     });

//     //Filters the bets based on if there pending
//     const pendingBet = otherStakes
//       .filter((stake) => stake.bet.status === "PENDING")
//       .map((stake) => stake.get({ plain: true }));

//       //filter the bets based on if there in progress
//     const activeBet = otherStakes
//       .filter((stake) => stake.bet.status === "IN_PROGRESS")
//       .map((stake) => stake.get({ plain: true }));

//     res.render("profile", { user, pendingBet, activeBet });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// route for login
router.get("/login", async (req, res) => {
  //If user is already logged in, then it will redirect them
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("login");
});

//Route for signing up
router.get("/sign-up", async (req, res) => {
  res.render("signup");
});

module.exports = router;
