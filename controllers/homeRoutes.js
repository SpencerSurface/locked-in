const express = require('express');
const router = express.Router();
const {User, Bet, Stake, Vote} = require('../models');

router.get('/', async (req, res) => {
    try {
        const bets = await Bet.findAll();
        res.render('index', {bets});
    } catch (error) {
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

module.exports = router;