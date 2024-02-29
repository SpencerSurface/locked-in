const router = require('express').Router();

const betRoutes = require('./betRoutes');

router.use("/bets", betRoutes);

module.exports = router;