const router = require('express').Router();

const betRoutes = require('./betRoutes');
const stakeRoutes = require('./stakeRoutes');
const userRoutes = require('./userRoutes');
const voteRoutes = require('./voteRoutes');

router.use("/bets", betRoutes);
router.use("/stakes", stakeRoutes);
router.use("/users", userRoutes);
router.use("/votes", voteRoutes);

module.exports = router;