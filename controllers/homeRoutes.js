const express = require("express");
const router = express.Router();
const { User, Bet, Stake, Vote } = require("../models");

// Home page
router.get("/", async (req, res) => {
    try {
        // Get the bet data from the database (completed bets only)
        const betData = await Bet.findAll({
            where: {
                status: "SETTLED"
            },
            include: User
        });
        // Serialize the bet data
        const completedBets = betData.map((bet) => bet.get({plain: true}));
        // Get the username of the winner of the bet
        completedBets.forEach((bet) => {
            if (bet.winner != null) {
                bet.winner = bet.users.filter((user) => user.id === bet.winner)[0];
            }
        });
        // Compile stats: number of completed bets, largest bet won, largest amount of money lost in a single bet
        const stats = {};
        stats.num_bets = await Bet.count({
            where: {
                status: "SETTLED"
            }
        });
        stats.big_win = await Bet.max("amount");
        const stakeData = await Stake.findAll({
            order: [["amount", "DESC"]],
            include: Bet
        });
        stats.big_loss = 0;
        stakeData.forEach((stake) => {
            if (stake.bet.status === "SETTLED" && stake.bet.winner !== stake.user_id && stake.amount > stats.big_loss) {
                stats.big_loss = stake.amount;
            }
        })
        // Render the homepage
        res.render("homepage", {bets: completedBets, stats, logged_in: req.session.logged_in});
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Login page
router.get("/login", (req, res) => {
    // If the user is signed in, send them to their profile
    if (req.session.logged_in) {
        res.redirect("/profile");
        return;
    }

    // Else, render the login page
    res.render("login");
});

// Signup page
router.get("/signup", (req, res) => {
    // If the user is signed in, send them to their profile
    if (req.session.logged_in) {
        res.redirect("/profile");
        return;
    }

    // Else, render the signup page
    res.render("signup");
});

// Account page
router.get("/account", async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect("/login");
        }
        const user = await User.findByPk(req.session.user_id, {
            include: [Bet]
        });
        res.render("account", {user, logged_in: req.session.logged_in});
    } catch(error) {
        res.status(500).json(error);
    }
});

// Bet page
router.get("/bet/:id", async (req, res) => {
    try {
        // Get the bet data from the database
        const betData = await Bet.findByPk(req.params.id, {
            include: User
        });
        // Check if the bet exists
        if (!betData) {
            res.status(404).redirect("/404");
            return;
        }
        // Serialize the data
        const bet = betData.get({plain: true});
        // Get the username of the user who created the bet, and the user who won the bet (if there is a winner)
        bet.created_by = bet.users.filter((user) => user.id === bet.created_by)[0].username;
        if (bet.winner) {
            bet.winner = bet.users.filter((user) => user.id === bet.winner)[0].username;
        }
        // Render the page, passing the data
        res.render("bet", {bet, logged_in: req.session.logged_in});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//Route for signing up
router.get("/sign-up", async (req, res) => {
    res.render("signup");
});

// 404 page
router.get("/404", (req, res) => {
    res.render("404");
});

module.exports = router;
