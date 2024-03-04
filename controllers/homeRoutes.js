const express = require('express');
const router = express.Router();
const {User, Bet, Stake, Vote} = require('../models');

router.get('/', async (req, res) => {
    try {
        // Get the bet data from the database
        const betData = await Bet.findAll({include: User});
        // Serialize the bet data
        const bets = betData.map((bet) => bet.get({plain: true}));
        // Ignore uncompleted bets
        const completedBets = bets.filter((bet) => bet.status === "SETTLED");
        // Get the username of the winner of the bet
        completedBets.forEach((bet) => {
            if (bet.winner != null) {
                bet.winner = bet.users.filter((user) => user.id === bet.winner)[0];
            }
        });
        // Compile stats
        // TODO
        // Render the homepage
        res.render('homepage', {bets: completedBets});
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.get('/profile', async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login');
        }
        const user = await User.findByPk(req.session.user_id, {
            include: [Bet]
        });
        res.render('profile', {user});
    } catch(error) {
        res.status(500).json(error)
    }
});

// Login route
router.get("/login", (req, res) => {
    // If the user is signed in, send them to their profile
    if (req.session.logged_in) {
        res.redirect("/profile");
        return;
    }

    // Else, render the login page
    res.render("login");
});

// Signup route
router.get("/signup", (req, res) => {
    // If the user is signed in, send them to their profile
    if (req.session.logged_in) {
        res.redirect("/profile");
        return;
    }

    // Else, render the signup page
    res.render("signup");
});

module.exports = router;