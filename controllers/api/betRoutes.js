const router = require('express').Router();
const { Bet, Stake } = require('../../models');

// Create a new bet
// Assume req.body contains at least title and stakes where
// title is the title of the bet and
// stakes is an array of objects each containing 
    // user_id: the user id of the users associated with the stake,
    // amount: the proposed amount for each user to bet
router.post('/', async (req, res) => {
    try {
        // Create the bet
        const newBet = await Bet.create({
            title: req.body.title,
            // The amount of the bet is the sum of the amounts of the stakes
            amount: req.body.stakes.reduce((acc, current) => acc + current.amount, 0)
        });
        
        // Create the stakes specified for the bet
        const newStakes = [];
        req.body.stakes.forEach(async (stake) => {
            newStakes.push(await Stake.create({
                user_id: stake.user_id,
                bet_id: newBet.id,
                amount: stake.amount
            }));
        });

        res.status(200).json(newBet);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

// Update a bet
router.put('/:id', async (req, res) => {
    try {
        const updatedBet = await Bet.update(
            {
                ...req.body
            },
            {
                where: {
                    id: req.params.id
                }
            }
        );
        res.status(200).json(updatedBet);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedBet = await Bet.destroy({
            where: {
                id: req.params.id
            },
        });

        if (!deletedBet) {
            res.status(404).json({ message: 'No bet found with this id!' });
        return;
        }

        res.status(200).json(deletedBet);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;