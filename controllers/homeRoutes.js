const express = require('express');
const router = express.Router();
const {User, Bet, Stake, Vote} = require('../models');

// Home page
router.get('/', async (req, res) => {
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
        // Compile stats: number of completed bets, 
        const stats = {};
        stats.num_bets = await Bet.count({
            where: {
                status: "SETTLED"
            }
        });
        console.log(stats);
        // Render the homepage
        res.render('homepage', {bets: completedBets, stats});
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Profile page
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

module.exports = router;